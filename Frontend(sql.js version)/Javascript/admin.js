(async () => {
  const SQL = await initSqlJs({ locateFile: f => `Javascript/${f}` });

  const uDump = localStorage.getItem("userDatabase");
  const pDump = localStorage.getItem("productDatabase");
  const uDb   = uDump ? new SQL.Database(Uint8Array.from(JSON.parse(uDump))) : null;
  const pDb   = pDump ? new SQL.Database(Uint8Array.from(JSON.parse(pDump))) : null;

  function persist(db, key) {
    localStorage.setItem(key, JSON.stringify(Array.from(db.export())));
  }

  if (uDb) {
    const rows = uDb.exec("SELECT userID, username, email, role FROM users")[0]?.values || [];
    const tbody = document.querySelector("#user-table tbody");
    rows.forEach(([id, username, email, role]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${id}</td>
        <td>${username}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td>
          <button class="table-btn delete-user" data-id="${id}">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  if (pDb) {
    const rows = pDb.exec("SELECT productID, name, owner, price FROM products")[0]?.values || [];
    const tbody = document.querySelector("#product-table tbody");
    rows.forEach(([id, name, owner, price]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${owner}</td>
        <td>${price}</td>
        <td>
          <button class="table-btn delete-product" data-id="${id}">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  document.querySelectorAll(".delete-user").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (!confirm(`Delete user #${id}?`)) return;

      uDb.run("DELETE FROM users WHERE userID = ?", [id]);
      persist(uDb, "userDatabase");

      btn.closest("tr").remove();
    });
  });

  document.querySelectorAll(".delete-product").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (!confirm(`Delete product #${id}?`)) return;

      pDb.run("DELETE FROM products WHERE productID = ?", [id]);
      persist(pDb, "productDatabase");

      btn.closest("tr").remove();
    });
  });

})();
