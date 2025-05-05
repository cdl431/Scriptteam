
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

  renderAllProducts();

  document.getElementById("search-button")
    .addEventListener("click", () => {
      const term    = document.getElementById("search-input")
                            .value.trim().toLowerCase();
      const pattern = `%${term}%`;

      const res = db.exec(`
        SELECT productID, name, price, description, imageURL
        FROM products
        WHERE lower(name) LIKE '${pattern}'
           OR lower(description) LIKE '${pattern}'
      `)[0];

      const rows = res?.values || [];
      displayProducts(rows, document.getElementById("search-results-container"));
    });

  function renderAllProducts() {
    const res = db.exec(`
      SELECT productID, name, price, description, imageURL
      FROM products
    `)[0];
    const rows = res?.values || [];
    displayProducts(rows, document.getElementById("featured-container"));
  }

  function displayProducts(rows, container) {
    container.innerHTML = "";
    rows.forEach(([id, name, price, desc, imageURL]) => {
      const imgSrc = imageURL || "Images/placeholder_image.jpg";
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <a href="product.html?id=${id}">
          <img src="${imgSrc}" alt="${name}" />
          <div class="description">
            <h5>${name}</h5>
            <span>${desc.slice(0,40)}…</span>
            <h4>$${price}</h4>
          </div>
        </a>`;
      container.appendChild(div);
    });
  }
})();
