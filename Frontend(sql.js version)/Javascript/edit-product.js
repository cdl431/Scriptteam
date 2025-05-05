function initProductDb(SQL) {
    let pdb;
    const saved = localStorage.getItem("productDatabase");
    if (saved) {
      pdb = new SQL.Database(Uint8Array.from(JSON.parse(saved)));
    } else {
      pdb = new SQL.Database();
      pdb.run(`
        CREATE TABLE IF NOT EXISTS products (
          productID   INTEGER PRIMARY KEY,
          name        TEXT,
          description TEXT,
          price       REAL,
          owner       INTEGER,
          imageURL    TEXT
        );
      `);
      localStorage.setItem(
        "productDatabase",
        JSON.stringify(Array.from(pdb.export()))
      );
    }
    return pdb;
  }
  
  (async () => {
    const SQL = await initSqlJs({ locateFile: f => `Javascript/${f}` });
    const db  = initProductDb(SQL);
  
    const me        = JSON.parse(localStorage.getItem("user") || "{}");
    const welcome   = document.getElementById("welcome-msg");
    const loginBtn  = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const logoutBtn = document.getElementById("logout-btn");
  
    if (me.firstName) {
      welcome.textContent   = `Welcome, ${me.firstName}!`;
      welcome.style.display = "inline-block";
      loginBtn.style.display   = "none";
      signupBtn.style.display  = "none";
      logoutBtn.style.display  = "inline-block";
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "HomePage.html";
      });
    }
  
    const ownerID    = me.userID;
    const listEl     = document.getElementById("userProductList");
    const selectEl   = document.getElementById("productSelect");
    const noProdMsg  = document.querySelector(".no-products");
    const editForm   = document.getElementById("editProductForm");
  
    const res = db.exec(`
      SELECT productID, name, description, price
      FROM products
      WHERE owner = ${ownerID}
    `)[0];
  
    if (!res || res.values.length === 0) {
      noProdMsg.style.display      = "block";
      listEl.style.display         = "none";
      editForm.style.display       = "none";
      return;
    }

    noProdMsg.style.display = "none";
    res.values.forEach(([id, name]) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = name;
      selectEl.appendChild(opt);
    });
  
    function loadProduct(id) {
      const row = db.exec(`
        SELECT name, description, price
        FROM products
        WHERE productID = ${id}
      `)[0].values[0];
  
      const [nm, desc, pr] = row;
      document.getElementById("productName").value        = nm;
      document.getElementById("productDescription").value = desc;
      document.getElementById("productPrice").value       = pr;
      editForm.style.display = "block";
    }
  
    selectEl.addEventListener("change", () => {
      loadProduct(selectEl.value);
    });

    loadProduct(selectEl.value);
  
    editForm.addEventListener("submit", e => {
      e.preventDefault();
  
      const id   = selectEl.value;
      const nm   = document.getElementById("productName").value.trim();
      const desc = document.getElementById("productDescription").value.trim();
      const pr   = parseFloat(document.getElementById("productPrice").value);
  
      const stmt = db.prepare(`
        UPDATE products
        SET name        = $nm,
            description = $desc,
            price       = $pr
        WHERE productID = $id
      `);
      stmt.bind({ $nm: nm, $desc: desc, $pr: pr, $id: id });
      stmt.step();
      stmt.free();
  
      localStorage.setItem(
        "productDatabase",
        JSON.stringify(Array.from(db.export()))
      );
  
      window.location.href = "account.html";
    });
  })();
  