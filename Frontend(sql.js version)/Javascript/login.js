let db;

initSqlJs({
  locateFile: file => `Javascript/${file}` // adjust if your path is different
}).then(SQLLib => {
  window.SQL = SQLLib;
  initDatabase();
});

function initDatabase() {
  if (localStorage.getItem("userDatabase")) {
    const savedDb = Uint8Array.from(JSON.parse(localStorage.getItem("userDatabase")));
    db = new SQL.Database(savedDb);
  } else {
    console.error("No saved user database found.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (db) {
        const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
        stmt.bind([username, password]);

        if (stmt.step()) {
          const row = stmt.getAsObject();
          console.log("Login successful:", row);

          localStorage.setItem("user", JSON.stringify(row));
          window.location.href = "HomePage.html";
        } else {
          console.error("Invalid username or password");
          document.getElementById("error-message").style.display = "block";
        }

        stmt.free();
      } else {
        console.error("Database not loaded");
      }
    });
  }
});
