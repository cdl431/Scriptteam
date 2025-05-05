export default function initAccount() {
  let db, SQL, current;

  initSqlJs({ locateFile: f => `Javascript/${f}` }).then(SQLLib => {
    SQL = SQLLib;
    const saved = localStorage.getItem("userDatabase");
    if (!saved) return;

    db      = new SQL.Database(Uint8Array.from(JSON.parse(saved)));
    current = JSON.parse(localStorage.getItem("user") || "{}");
    if (!current.userID) { location.href = "login.html"; return; }

    document.getElementById("display-username").textContent = current.username;
    document.getElementById("display-email").textContent    = current.email;

    wireEvents();
  });

  function saveDB() {
    localStorage.setItem("userDatabase", JSON.stringify(Array.from(db.export())));
  }

  function v(id) { return document.getElementById(id).value.trim(); }

  function wireEvents() {
    const view = document.getElementById("profile-view");
    const form = document.getElementById("edit-form");

    document.getElementById("edit-btn").onclick = () => {
      ["firstName","lastName","username","email","phone"].forEach(f =>
        document.getElementById(f).value = current[f] || ""
      );
      view.style.display  = "none";
      form.style.display  = "flex";
    };

    document.getElementById("cancel-btn").onclick = () => {
      form.style.display  = "none";
      view.style.display  = "block";
    };

    document.getElementById("save-btn").onclick   = updateProfile;
    document.getElementById("delete-btn").onclick = deleteAccount;
  }

  function updateProfile() {
    const stmt = db.prepare(`
      UPDATE users
      SET firstName=?, lastName=?, username=?, email=?, phone=?
      WHERE userID=?`);
    stmt.run([v("firstName"), v("lastName"), v("username"), v("email"), v("phone"), current.userID]);
    stmt.free();  saveDB();

    Object.assign(current, {
      firstName: v("firstName"), lastName: v("lastName"),
      username: v("username"),   email: v("email"), phone: v("phone")
    });
    localStorage.setItem("user", JSON.stringify(current));

    document.getElementById("display-username").textContent = current.username;
    document.getElementById("display-email").textContent    = current.email;

    document.getElementById("edit-form").style.display  = "none";
    document.getElementById("profile-view").style.display = "block";
  }

  function deleteAccount() {
    if (!confirm("Delete account permanently?")) return;
    db.run(`DELETE FROM users WHERE userID=${current.userID}`);
    saveDB();
    localStorage.removeItem("user");
    location.href = "login.html";
  }
}
