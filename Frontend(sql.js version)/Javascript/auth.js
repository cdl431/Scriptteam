let db;
let SQL;

async function hashPassword(pw) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(pw)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

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
    // Load existing DB
    const saved = Uint8Array.from(
      JSON.parse(localStorage.getItem("userDatabase"))
    );
    db = new SQL.Database(saved);

    // Migrate: add balance column if missing
    const pragma = db.exec("PRAGMA table_info(users)")[0];
    const cols = pragma ? pragma.values.map(r => r[1]) : [];
    if (!cols.includes("balance")) {
      db.run(
        "ALTER TABLE users ADD COLUMN balance REAL DEFAULT 0;"
      );
      saveDatabase();
    }

  } else {
    // Fresh DB
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS users(
        userID    INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName  TEXT,
        username  TEXT UNIQUE,
        email     TEXT UNIQUE,
        password  TEXT,
        phone     TEXT,
        role      TEXT,
        balance   REAL DEFAULT 0
      );
    `);
    saveDatabase();
  }
}

function saveDatabase() {
  const binary = db.export();
  localStorage.setItem(
    "userDatabase",
    JSON.stringify(Array.from(binary))
  );
}

function loginUser(user) {
  const { password, ...noPw } = user;
  localStorage.setItem("user", JSON.stringify(noPw));
}

function setupSignupHandler() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    document.getElementById("error-message").style.display = "none";

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const username  = document.getElementById("username").value.trim();
    const email     = document.getElementById("email").value.trim();
    const password  = document.getElementById("password").value.trim();
    const phone     = document.getElementById("phone").value.trim();
    const role      = document.getElementById("role").value;

    if (!firstName || !lastName || !username || !email || !password || !role) {
      document.getElementById("error-message").textContent =
        "Please fill out all required fields.";
      document.getElementById("error-message").style.display = "block";
      return;
    }

    // Check duplicates
    const chk = db.prepare(
      "SELECT 1 FROM users WHERE username = ? OR email = ?"
    );
    chk.bind([username, email]);
    const exists = chk.step();
    chk.free();

    if (exists) {
      document.getElementById("error-message").textContent =
        "Username or email already taken.";
      document.getElementById("error-message").style.display = "block";
      return;
    }

    // Hash password & insert
    const hashed = await hashPassword(password);
    const ins = db.prepare(
      "INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, 0)"
    );
    ins.run([
      firstName,
      lastName,
      username,
      email,
      hashed,
      phone,
      role
    ]);
    ins.free();
    saveDatabase();

    // Log in & redirect
    loginUser({
      firstName,
      lastName,
      username,
      email,
      phone,
      role,
      balance: 0
    });
    window.location.href = "HomePage.html";
  });
}

function setupShowUsersHandler() {
  const btn = document.getElementById("show-users");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const dbCopy = new SQL.Database(db.export());
    const res    = dbCopy.exec("SELECT userID, username, email, role, balance FROM users");
    console.table(res[0]?.values || []);
    alert("Check console for user list (including balances).");
  });
}
