document.addEventListener("DOMContentLoaded", () => {
    const page = window.location.pathname;
    const isEditPage = page.includes("edit-product");
  
    if (!isEditPage) return;
  
    const productListContainer = document.getElementById("userProductList");
    const form = document.getElementById("editProductForm");
    const noProductsMsg = document.querySelector(".no-products");
  
    const nameInput = document.getElementById("productName");
    const descInput = document.getElementById("productDescription");
    const priceInput = document.getElementById("productPrice");
    const categorySelect = document.getElementById("productCategory");
    const customCategoryInput = document.getElementById("customCategory");
    const customCategoryContainer = document.getElementById("customCategoryContainer");
  
    let selectedProductIndex = null;
  
    // Mock fallback data if localStorage is empty
    if (!localStorage.getItem("userProducts")) {
      const fallback = [
        { name: "One Piece", description: "It’s real!", price: 19.99, category: "movies", image: "onepiece.jpg" },
        { name: "Naruto", description: "Believe it", price: 14.99, category: "series", image: "naruto.jpg" }
      ];
      localStorage.setItem("userProducts", JSON.stringify(fallback));
    }
  
    const products = JSON.parse(localStorage.getItem("userProducts")) || [];
  
    if (products.length === 0) {
      noProductsMsg.style.display = "block";
      productListContainer.style.display = "none";
      form.style.display = "none";
      return;
    }
  
    noProductsMsg.style.display = "none";
    productListContainer.innerHTML = "<h3>Select a product to edit:</h3>";
  
    products.forEach((product, index) => {
      const btn = document.createElement("button");
      btn.textContent = product.name;
      btn.className = "account-btn";
      btn.style.margin = "5px";
  
      btn.addEventListener("click", () => {
        selectedProductIndex = index;
  
        nameInput.value = product.name;
        descInput.value = product.description;
        priceInput.value = product.price;
        categorySelect.value = product.category;
  
        if (product.category === "other") {
          customCategoryContainer.style.display = "block";
          customCategoryInput.value = product.customCategory || "";
        } else {
          customCategoryContainer.style.display = "none";
          customCategoryInput.value = "";
        }
  
        form.style.display = "block";
      });
  
      productListContainer.appendChild(btn);
    });
  
    categorySelect.addEventListener("change", () => {
      customCategoryContainer.style.display = categorySelect.value === "other" ? "block" : "none";
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (selectedProductIndex === null) {
        alert("Please select a product to edit first.");
        return;
      }
  
      const updatedProduct = {
        name: nameInput.value.trim(),
        description: descInput.value.trim(),
        price: parseFloat(priceInput.value),
        category: categorySelect.value === "other" ? "other" : categorySelect.value,
      };
  
      if (updatedProduct.category === "other") {
        updatedProduct.customCategory = customCategoryInput.value.trim();
      }
  
      products[selectedProductIndex] = { ...products[selectedProductIndex], ...updatedProduct };
  
      localStorage.setItem("userProducts", JSON.stringify(products));
      alert("Product updated!");
      location.reload();
    });
  });
  