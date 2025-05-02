let db;
let SQL;

initSqlJs({
  locateFile: file => `Javascript/${file}`
}).then(SQLLib => {
  SQL = SQLLib;
  initDatabase();

  // Only add DOM listeners after DB is ready
  setupSignupHandler();
  setupShowUsersHandler();
});

function initDatabase() {
  if (localStorage.getItem("userDatabase")) {
    console.log("Loading saved database from localStorage...");
    const savedDb = Uint8Array.from(JSON.parse(localStorage.getItem("userDatabase")));
    db = new SQL.Database(savedDb);
  } else {
    console.log("No saved database. Creating a new one...");
    db = new SQL.Database();
    const createTableQuery = `
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
    `;
    db.run(createTableQuery);
    saveDatabase();
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

function logoutUser() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function isUserLoggedIn() {
  return !!localStorage.getItem("user");
}

function getCurrentUser() {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}

function setupSignupHandler() {
  const signupForm = document.getElementById("signup-form");
  if (!signupForm) return;

  signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : "";
    const role = document.getElementById('role').value;

    if (firstName && lastName && username && email && password && role) {
      signupRequest(firstName, lastName, username, email, password, phone, role);
    } else {
      document.getElementById('error-message').style.display = 'block';
    }
  });
}

function signupRequest(firstName, lastName, username, email, password, phone, role) {
  const checkUserQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  const checkStmt = db.prepare(checkUserQuery);
  checkStmt.bind([username, email]);

  let exists = false;
  while (checkStmt.step()) {
    exists = true;
  }
  checkStmt.free();

  if (exists) {
    alert('Username or email already in use.');
  } else {
    const insertQuery = `
      INSERT INTO users (firstName, lastName, username, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const insertStmt = db.prepare(insertQuery);
    insertStmt.bind([firstName, lastName, username, email, password, phone, role]);
    insertStmt.step();
    insertStmt.free();

    saveDatabase();
    document.getElementById("signup-form").reset();

    loginUser({ firstName, lastName, username, email, password, phone, role });
    window.location.href = "HomePage.html";
  }
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
        row.forEach((val, index) => {
          userObj[columns[index]] = val;
        });
        return userObj;
      });

      console.table(users);
      alert("Check DevTools console for the user list.");
    }
  });
}

