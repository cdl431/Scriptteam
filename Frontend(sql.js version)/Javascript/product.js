
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
  
    const db = initProductDb(SQL);
  
    const params = new URLSearchParams(window.location.search);
    const id     = params.get("id");
    if (!id) {
      document.getElementById("prod-name").textContent = "Product not found";
      return;
    }

    const result = db.exec(`
      SELECT name, price, description, imageURL
      FROM products
      WHERE productID = ${id}
    `)[0];
  
    if (!result) {
      document.getElementById("prod-name").textContent = "Product not found";
      return;
    }
  
    const [name, price, description, imageURL] = result.values[0];
    document.getElementById("prod-name").textContent        = name;
    document.getElementById("prod-price").textContent       = `$${price}`;
    document.getElementById("prod-description").textContent = description;
    if (imageURL) {
      document.getElementById("prod-image").src = imageURL;
    }
  
    document.getElementById("add-to-cart")
      .addEventListener("click", () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find(item => item.id === id);
        if (existing) {
          existing.qty++;
        } else {
          cart.push({ id, name, price: Number(price), qty: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`✅ Added "${name}" to your cart!`);
      });
  })();
  