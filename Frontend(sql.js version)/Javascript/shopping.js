
function initProductDb(SQL) {
  const key = "productDatabase";
  let pdb;
  const saved = localStorage.getItem(key);
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
    localStorage.setItem(key, JSON.stringify(Array.from(pdb.export())));
  }
  return pdb;
}

(async () => {
  const SQL = await initSqlJs({ locateFile: f => `Javascript/${f}` });
  const db  = initProductDb(SQL);


  const featureSection       = document.getElementById("feature");
  const searchResultsSection = document.getElementById("search-results");
  const featuredContainer    = document.getElementById("featured-container");
  const searchContainer      = document.getElementById("search-results-container");
  const searchInput          = document.getElementById("search-input");
  const searchButton         = document.getElementById("search-button");

 
  searchResultsSection.style.display = "none";

  function renderAllProducts() {
    const res = db.exec(`
      SELECT productID, name, price, description, imageURL
      FROM products
    `)[0] || { values: [] };
    displayProducts(res.values, featuredContainer);
  }


  function displayProducts(rows, container) {
    container.innerHTML = "";
    if (rows.length === 0) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }
    rows.forEach(([id, name, price, desc, imageURL]) => {
      const imgSrc = imageURL || "Images/placeholder_image.jpg";
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <a href="product.html?id=${id}">
          <img src="${imgSrc}" alt="${name}" />
          <div class="description">
            <h5>${name}</h5>
            <span>${desc.slice(0,40)}…</span>
            <h4>$${price}</h4>
          </div>
        </a>
      `;
      container.appendChild(card);
    });
  }


  function doSearch() {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
   
      featureSection.style.display       = "block";
      searchResultsSection.style.display = "none";
      return;
    }
    const pattern = `%${term}%`;
    const res = db.exec(`
      SELECT productID, name, price, description, imageURL
      FROM products
      WHERE lower(name) LIKE '${pattern}'
         OR lower(description) LIKE '${pattern}'
    `)[0] || { values: [] };


    displayProducts(res.values, searchContainer);

    featureSection.style.display       = "none";
    searchResultsSection.style.display = "block";
  }

  searchButton.addEventListener("click", doSearch);
  searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") doSearch();
  });

  renderAllProducts();
})();
