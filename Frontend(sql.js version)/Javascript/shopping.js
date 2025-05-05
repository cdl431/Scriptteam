let db;
let SQL;

initSqlJs({
  locateFile: file => `Javascript/${file}`
}).then(SQLLib => {
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
        description TEXT
      );
    `);
    // Sample products (optional for demo)
    const sampleProducts = [
      { name: "Indie Book", price: 75, description: "A thoughtful indie publication." },
      { name: "Collector DVD", price: 130, description: "A rare horror collector's edition." },
    ];
    sampleProducts.forEach(p => {
      const stmt = db.prepare("INSERT INTO products (name, price, description) VALUES (?, ?, ?)");
      stmt.run([p.name, p.price, p.description]);
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
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const resultsContainer = document.getElementById("search-results-container");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = "";

    if (!query) {
      resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
      return;
    }

    const res = db.exec("SELECT * FROM products");
    const rows = res[0]?.values || [];

    const matched = rows.filter(([id, name, price, description]) =>
      name.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query)
    );

    if (matched.length === 0) {
      resultsContainer.innerHTML = "<p>No matching products found.</p>";
      return;
    }

    matched.forEach(([id, name, price, description]) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.innerHTML = `
        <div class="description">
          <h5>${name}</h5>
          <p>${description}</p>
          <h4>$${price}</h4>
        </div>
      `;
      resultsContainer.appendChild(productDiv);
    });
  });
}
