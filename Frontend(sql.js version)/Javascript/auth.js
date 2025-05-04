let db;
let SQL;

initSqlJs({
  locateFile: file => `Javascript/${file}`
}).then(SQLLib => {
  SQL = SQLLib;
  initDatabase();
  setupSignupHandler();
  setupLoginHandler();
  setupShowUsersHandler();
});

function initDatabase() {
  if (localStorage.getItem("userDatabase")) {
    const savedDb = Uint8Array.from(JSON.parse(localStorage.getItem("userDatabase")));
    db = new SQL.Database(savedDb);
    console.log("Database loaded from localStorage.");
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        userID INTEGER PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        role TEXT
      );
    `);
    saveDatabase();
    console.log("New database created.");
  }
}

function saveDatabase() {
  const binaryArray = db.export();
  localStorage.setItem("userDatabase", JSON.stringify(Array.from(binaryArray)));
}

function loginUser(userData) {
  const { password, ...userWithoutPassword } = userData;
  localStorage.setItem("user", JSON.stringify(userWithoutPassword));
}

function setupSignupHandler() {
  const signupForm = document.getElementById("signup-form");
  if (!signupForm) return;

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const role = document.getElementById("role").value;

    if (firstName && lastName && username && email && password && role) {
      const checkStmt = db.prepare("SELECT * FROM users WHERE username = ? OR email = ?");
      checkStmt.bind([username, email]);

      let exists = false;
      while (checkStmt.step()) {
        exists = true;
      }
      checkStmt.free();

      if (exists) {
        alert("Username or email already exists.");
      } else {
        const insertStmt = db.prepare(`
          INSERT INTO users (firstName, lastName, username, email, password, phone, role)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        insertStmt.bind([firstName, lastName, username, email, password, phone, role]);
        insertStmt.step();
        insertStmt.free();
        saveDatabase();

        loginUser({ firstName, lastName, username, email, password, phone, role });
        window.location.href = "HomePage.html";
      }
    } else {
      document.getElementById("error-message").style.display = "block";
    }
  });
}

function setupLoginHandler() {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const usernameOrEmail = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const query = `
      SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?
    `;
    const stmt = db.prepare(query);
    stmt.bind([usernameOrEmail, usernameOrEmail, password]);

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      loginUser(row);
      window.location.href = "HomePage.html";
    } else {
      stmt.free();
      alert("Invalid username/email or password.");
    }
  });
}

function setupShowUsersHandler() {
  const showBtn = document.getElementById("show-users");
  if (!showBtn) return;

  showBtn.addEventListener("click", () => {
    const savedDb = localStorage.getItem("userDatabase");
    if (!savedDb) {
      alert("No database found.");
      return;
    }

    const dbTemp = new SQL.Database(Uint8Array.from(JSON.parse(savedDb)));
    const result = dbTemp.exec("SELECT * FROM users");

    if (result.length === 0) {
      console.log("No users found.");
    } else {
      const columns = result[0].columns;
      const rows = result[0].values;

      const users = rows.map(row => {
        const userObj = {};
        row.forEach((val, i) => {
          userObj[columns[i]] = val;
        });
        return userObj;
      });

      console.table(users);
      alert("Check console for user list.");
    }
  });
}

function loginAsGuest() {
  const guestUser = {
    firstName: 'Guest',
    lastName: '',
    username: 'guest_user',
    email: '',
    password: '',
    phone: '',
    role: 'Guest'
  };

  localStorage.setItem("user", JSON.stringify(guestUser));

  window.location.href = "HomePage.html";
}

document.addEventListener("DOMContentLoaded", function() {
  const guestBtn = document.getElementById("guest-btn");
  if (guestBtn) {
    guestBtn.addEventListener("click", function(event) {
      event.preventDefault();
      loginAsGuest();
    });
  }
});

