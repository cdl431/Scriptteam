import logout from "./logout.js";

let db, SQL;

initSqlJs({ locateFile: f => `Javascript/${f}` }).then(SQLLib => {
  SQL = SQLLib;
  boot();
});

function boot() {
  const saved = localStorage.getItem("userDatabase");
  if (!saved) return;
  db = new SQL.Database(Uint8Array.from(JSON.parse(saved)));

  const me = JSON.parse(localStorage.getItem("user") || "{}");
  if (me.role !== "Admin") { location.href = "HomePage.html"; return; }

  document.getElementById("logout-btn").onclick = logout;

  renderUsers();
  renderProducts();
}

/* ── USERS ───────────────────────────────────────────── */
function renderUsers() {
  const tbody = document.querySelector("#user-table tbody");
  tbody.innerHTML = "";

  const rows = db.exec("SELECT userID,username,email,role FROM users")[0]?.values || [];
  rows.forEach(([id,u,e,r]) => {
    const tr = tbody.insertRow();
    tr.innerHTML = `
      <td>${id}</td><td>${u}</td><td>${e}</td>
      <td>
        <select data-id="${id}" class="role-select">
          <option ${r==="User"   ?"selected":""}>User</option>
          <option ${r==="Seller" ?"selected":""}>Seller</option>
          <option ${r==="Admin"  ?"selected":""}>Admin</option>
        </select>
      </td>
      <td><button class="danger" data-del="${id}">Delete</button></td>
    `;
  });

  tbody.addEventListener("change", e => {
    if (!e.target.matches(".role-select")) return;
    const id   = e.target.dataset.id;
    const role = e.target.value;
    db.run(`UPDATE users SET role='${role}' WHERE userID=${id}`);
    saveDB();
  });

  tbody.addEventListener("click", e => {
    if (!e.target.dataset.del) return;
    const id = e.target.dataset.del;
    if (!confirm("Delete user "+id+" ?")) return;
    db.run(`DELETE FROM users WHERE userID=${id}`);
    saveDB();
    renderUsers();
  });
}

/* ── PRODUCTS ────────────────────────────────────────── */
function renderProducts() {
  const tbody = document.querySelector("#product-table tbody");
  tbody.innerHTML = "";

  if (!tableExists("products")) return;

  const q = `
    SELECT p.productID, p.name, u.username, p.price
    FROM products p JOIN users u ON p.ownerID = u.userID
  `;
  const rows = db.exec(q)[0]?.values || [];
  rows.forEach(([pid,name,owner,price]) => {
    const tr = tbody.insertRow();
    tr.innerHTML = `
      <td>${pid}</td><td>${name}</td><td>${owner}</td><td>$${price}</td>
      <td><button class="danger" data-dprod="${pid}">Delete</button></td>
    `;
  });

  tbody.addEventListener("click", e => {
    if (!e.target.dataset.dprod) return;
    const pid = e.target.dataset.dprod;
    if (!confirm("Delete product "+pid+" ?")) return;
    db.run(`DELETE FROM products WHERE productID=${pid}`);
    saveDB();
    renderProducts();
  });
}

/* ── helpers ─────────────────────────────────────────── */
function saveDB() {
  localStorage.setItem("userDatabase", JSON.stringify(Array.from(db.export())));
}

function tableExists(name) {
  return db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${name}'`).length;
}
