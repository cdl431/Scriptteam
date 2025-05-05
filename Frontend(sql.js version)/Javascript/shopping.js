let db, SQL;

initSqlJs({ locateFile: file => `Javascript/${file}` }).then(SQLLib => {
  SQL = SQLLib;
  initProductDatabase();
  setupSearchHandler();
});

function initProductDatabase() {
  if (localStorage.getItem("productDatabase")) {
    const saved = Uint8Array.from(JSON.parse(localStorage.getItem("productDatabase")));
    db = new SQL.Database(saved);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        productID INTEGER PRIMARY KEY,
        name TEXT,
        price REAL,
        description TEXT,
        seller TEXT
      );
    `);
    const sampleProducts = [
      { name: "Indie Book", price: 75, description: "A thoughtful indie publication.", seller: "Alice" },
      { name: "Collector DVD", price: 130, description: "A rare horror collector's edition.", seller: "Bob" },
    ];    
    sampleProducts.forEach(p => {
      const stmt = db.prepare("INSERT INTO products (name, price, description, seller) VALUES (?, ?, ?, ?)");
      stmt.run([p.name, p.price, p.description, p.seller]);
      stmt.free();
    });
    saveProductDatabase();
  }
}

function saveProductDatabase() {
  const binaryArray = db.export();
  localStorage.setItem("productDatabase", JSON.stringify(Array.from(binaryArray)));
}

function setupSearchHandler() {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");
  const results = document.getElementById("search-results-container");

  button.addEventListener("click", () => {
    const query = input.value.trim().toLowerCase();
    results.innerHTML = "";

    const res = db.exec("SELECT * FROM products");
    const rows = res[0]?.values || [];

    const matched = rows.filter(([id, name, price, description, seller]) =>
      name.toLowerCase().includes(query) || description.toLowerCase().includes(query)
    );

    if (matched.length === 0) {
      results.innerHTML = "<p>No results found.</p>";
      return;
    }

    matched.forEach(([id, name, price, desc, seller]) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";  // Same class as featured products

      // Match the structure of featured product HTML for consistent styling
      productDiv.innerHTML = `
        <div class="product">
          <a href="product.html?id=${id}">
            <img src="Images/placeholder_image.jpg" alt="${name}">
            <div class="description">
              <span>${seller}</span>
              <h5>${name}</h5>
              <h4>$${price}</h4>
            </div>
            <i class="cart"></i>
          </a>
        </div>
      `;

      results.appendChild(productDiv);
    });
  });
}
