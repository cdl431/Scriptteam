let db;
let SQL;

initSqlJs({
  locateFile: file => `Javascript/${file}`
}).then(SQLLib => {
  SQL = SQLLib;
  initDatabase();
  setupLoginHandler();
  setupGuestLogin();
});

function initDatabase() {
  if (localStorage.getItem("userDatabase")) {
    const saved = Uint8Array.from(JSON.parse(localStorage.getItem("userDatabase")));
    db = new SQL.Database(saved);
  } else {
    console.error("No user database yet—tell your users to sign up first.");
  }
}

function setupLoginHandler() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const idField   = document.getElementById("username").value.trim();  
    const password  = document.getElementById("password").value.trim();

    if (!db) return;

    const stmt = db.prepare(
      "SELECT * FROM users WHERE (username=? OR email=?) AND password=?"
    );
    stmt.bind([idField, idField, password]);

    if (stmt.step()) {
      const user = stmt.getAsObject();
      delete user.password;
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "HomePage.html";
    } else {
      document.getElementById("error-message").style.display = "block";
    }
    stmt.free();
  });
}

function setupGuestLogin() {
  const btn = document.getElementById("guest-btn");
  if (!btn) return;
  btn.addEventListener("click", e => {
    e.preventDefault();
    const guest = {
      firstName: "Guest",
      lastName: "",
      username: "guest_user",
      email: "",
      phone: "",
      role: "Guest"
    };
    localStorage.setItem("user", JSON.stringify(guest));
    window.location.href = "HomePage.html";
  });
}
