
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
    // 1) Load the SQL.js runtime
    const SQL = await initSqlJs({ locateFile: f => `Javascript/${f}` });
  
    // 2) Initialize or load the products DB
    const db = initProductDb(SQL);
  
    // 3) Read ?id= from the URL
    const params = new URLSearchParams(window.location.search);
    const id     = params.get("id");
    if (!id) {
      document.getElementById("prod-name").textContent = "Product not found";
      return;
    }
  
    // 4) Query that product
    const result = db.exec(`
      SELECT name, price, description, imageURL
      FROM products
      WHERE productID = ${id}
    `)[0];
  
    // 5) If empty, show error
    if (!result) {
      document.getElementById("prod-name").textContent = "Product not found";
      return;
    }
  
    // 6) Destructure and render
    const [name, price, description, imageURL] = result.values[0];
    document.getElementById("prod-name").textContent        = name;
    document.getElementById("prod-price").textContent       = `$${price}`;
    document.getElementById("prod-description").textContent = description;
    if (imageURL) {
      document.getElementById("prod-image").src = imageURL;
    }
  
    // 7) Wire up Add to Cart
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
  