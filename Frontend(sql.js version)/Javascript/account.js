(async function() {
  const SQL = await initSqlJs({ locateFile: f => `Javascript/${f}` });

  const raw = localStorage.getItem("userDatabase");
  if (!raw) {
    alert("Database not initialized. Please log in again.");
    return window.location.href = "login.html";
  }
  const db = new SQL.Database(Uint8Array.from(JSON.parse(raw)));

  const me = JSON.parse(localStorage.getItem("user") || "{}");
  if (!me.userID) {
    return window.location.href = "login.html";
  }

  const adminLink = document.getElementById("admin-link");
  adminLink.style.display = (me.role === "Admin") ? "block" : "none";

  document.getElementById("display-username").textContent = me.username;
  document.getElementById("display-email").textContent    = me.email;
  document.getElementById("display-balance").textContent = (me.balance||0).toFixed(2);

  document.getElementById("logout-btn")
    .addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });

  document.getElementById("edit-btn")
    .addEventListener("click", () => {
      document.getElementById("firstName").value = me.firstName || "";
      document.getElementById("lastName").value  = me.lastName  || "";
      document.getElementById("username").value  = me.username  || "";
      document.getElementById("email").value     = me.email     || "";
      document.getElementById("phone").value     = me.phone     || "";

      document.getElementById("profile-view").style.display = "none";
      document.getElementById("edit-form").style.display    = "flex";
    });

  document.getElementById("cancel-btn")
    .addEventListener("click", () => {
      document.getElementById("edit-form").style.display    = "none";
      document.getElementById("profile-view").style.display = "block";
    });

  document.getElementById("save-btn")
    .addEventListener("click", () => {
      const fn = document.getElementById("firstName").value.trim();
      const ln = document.getElementById("lastName").value.trim();
      const un = document.getElementById("username").value.trim();
      const em = document.getElementById("email").value.trim();
      const ph = document.getElementById("phone").value.trim();

      const stmt = db.prepare(`
        UPDATE users
        SET firstName=?, lastName=?, username=?, email=?, phone=?
        WHERE userID=?
      `);
      stmt.run([fn, ln, un, em, ph, me.userID]);
      stmt.free();

      const exported = db.export();
      localStorage.setItem("userDatabase", JSON.stringify(Array.from(exported)));

      const updated = {
        ...me,
        firstName: fn,
        lastName: ln,
        username: un,
        email: em,
        phone: ph
      };
      localStorage.setItem("user", JSON.stringify(updated));

      document.getElementById("display-username").textContent = updated.username;
      document.getElementById("display-email").textContent    = updated.email;
      document.getElementById("edit-form").style.display     = "none";
      document.getElementById("profile-view").style.display  = "block";
    });

  document.getElementById("delete-btn")
    .addEventListener("click", () => {
      if (!confirm("Permanently delete your account?")) return;
      db.run(`DELETE FROM users WHERE userID=${me.userID}`);
      localStorage.setItem("userDatabase", JSON.stringify(Array.from(db.export())));
      localStorage.removeItem("user");
      window.location.href = "signup.html";
    });
})();
