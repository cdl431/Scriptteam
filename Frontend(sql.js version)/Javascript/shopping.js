(() => {
    const products = new Map();
  
    
    const addBtn = document.createElement("button");
    const productList = document.createElement("div");
    const infoBox = document.createElement("div");
  
    
    addBtn.textContent = "Add Product";
    addBtn.style.marginBottom = "20px";
  
    infoBox.style.display = "none";
    infoBox.style.marginTop = "20px";
    infoBox.style.padding = "10px";
    infoBox.style.border = "1px solid #ccc";
  
    
    document.body.appendChild(addBtn);
    document.body.appendChild(productList);
    document.body.appendChild(infoBox);
  
    
    function addProduct({ name, price, description }) {
      const id = Date.now(); // Unique ID
      products.set(id, { name, price, description });
  
      const el = document.createElement("div");
      el.textContent = name;
      el.style.cursor = "pointer";
      el.style.color = "blue";
      el.style.margin = "10px 0";
  
      el.addEventListener("click", () => showProduct(id));
      productList.appendChild(el);
    }
  
    
    function showProduct(id) {
      const product = products.get(id);
      if (!product) return;
  
      infoBox.innerHTML = `
        <h3>${product.name}</h3>
        <p><strong>Price:</strong> ${product.price}</p>
        <p>${product.description}</p>
      `;
      infoBox.style.display = "block";
    }
  
    
    addBtn.addEventListener("click", () => {
      const name = prompt("Product name:");
      const price = prompt("Product price:");
      const description = prompt("Product description:");
      if (name && price && description) {
        addProduct({ name, price, description });
      }
    });
  })();
  