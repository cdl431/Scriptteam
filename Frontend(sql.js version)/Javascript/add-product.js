
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
  
    const categoryEl = document.getElementById("productCategory");
    const customEl   = document.getElementById("customCategoryContainer");
    categoryEl.addEventListener("change", () => {
      customEl.style.display = categoryEl.value === "other" ? "block" : "none";
    });
  
    document.getElementById("addProductForm")
      .addEventListener("submit", async e => {
        e.preventDefault();
  
        const name        = document.getElementById("productName").value.trim();
        const description = document.getElementById("productDescription").value.trim();
        const price       = parseFloat(document.getElementById("productPrice").value);
        let category      = categoryEl.value;
        if (category === "other") {
          const custom = document.getElementById("customCategory").value.trim();
          if (custom) category = custom;
        }
  
        let imageURL = "";
        const fileIn  = document.getElementById("productImage");
        if (fileIn.files.length) {
          imageURL = await new Promise(resolve => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.readAsDataURL(fileIn.files[0]);
          });
        }
  
        const me = JSON.parse(localStorage.getItem("user") || "{}");
        const owner = me.userID || 0;

        const stmt = db.prepare(`
          INSERT INTO products 
            (name, description, price, owner, imageURL)
          VALUES 
            ($name, $desc, $price, $owner, $image)
        `);
        stmt.bind({
          $name:  name,
          $desc:  description,
          $price: price,
          $owner: owner,
          $image: imageURL
        });
        stmt.step();
        stmt.free();
  
        localStorage.setItem(
          "productDatabase",
          JSON.stringify(Array.from(db.export()))
        );
  
        window.location.href = "account.html";
      });
  })();
  