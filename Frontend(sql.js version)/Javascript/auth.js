let db;
let SQL;

initSqlJs({
  locateFile: file => `Javascript/${file}`
}).then(SQLLib => {
  SQL = SQLLib;
  initDatabase();
  setupSignupHandler();
  setupShowUsersHandler();   
});

function initDatabase() {
  if (localStorage.getItem("userDatabase")) {
    const saved = Uint8Array.from(JSON.parse(localStorage.getItem("userDatabase")));
    db = new SQL.Database(saved);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS users(
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
  }
}

function saveDatabase() {
  const binaryArray = db.export();
  localStorage.setItem("userDatabase", JSON.stringify(Array.from(binaryArray)));
}

function loginUser(u) {
  const { password, ...noPw } = u;
  localStorage.setItem("user", JSON.stringify(noPw));
}

function setupSignupHandler() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const username  = document.getElementById("username").value.trim();
    const email     = document.getElementById("email").value.trim();
    const password  = document.getElementById("password").value.trim();
    const phone     = document.getElementById("phone").value.trim();
    const role      = document.getElementById("role").value;

    if (firstName && lastName && username && email && password && role) {
      const chk = db.prepare("SELECT 1 FROM users WHERE username=? OR email=?");
      chk.bind([username, email]);
      const exists = chk.step();
      chk.free();

      if (exists) {
        document.getElementById("error-message").textContent = "Username or e‑mail already taken.";
        document.getElementById("error-message").style.display = "block";
      } else {
        const ins = db.prepare("INSERT INTO users VALUES(NULL,?,?,?,?,?,?,?)");
        ins.run([firstName, lastName, username, email, password, phone, role]);
        ins.free();
        saveDatabase();

        loginUser({ firstName, lastName, username, email, password, phone, role });
        window.location.href = "HomePage.html";
      }
    } else {
      document.getElementById("error-message").style.display = "block";
    }
  });
}

function setupShowUsersHandler() {
  const btn = document.getElementById("show-users");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const dbCopy = new SQL.Database(db.export());
    const res = dbCopy.exec("SELECT * FROM users");
    console.table(res[0]?.values || []);
    alert("Open the console for user list.");
  });
}
