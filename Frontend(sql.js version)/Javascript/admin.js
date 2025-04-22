document.addEventListener("DOMContentLoaded", () => {
    const userList = document.getElementById("userList");
    const productList = document.getElementById("productList");
  
    // Placeholder functions for backend integration
    function fetchUsers() {
      // Fetch from backend in the future
      return [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ];
    }
  
    function fetchProducts() {
      // Fetch from backend in the future
      return [
        { id: 101, name: "One Piece", category: "movies", price: 19.99 },
        { id: 102, name: "Halo 5", category: "games", price: 29.99 },
      ];
    }
  
    function renderUsers(users) {
      if (!users.length) {
        userList.innerHTML = "<p>No users found.</p>";
        return;
      }
  
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td><button class="account-btn">Remove</button></td>
            </tr>
          `).join("")}
        </tbody>
      `;
      userList.appendChild(table);
    }
  
    function renderProducts(products) {
      if (!products.length) {
        productList.innerHTML = "<p>No products found.</p>";
        return;
      }
  
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.name}</td>
              <td>${p.category}</td>
              <td>$${p.price.toFixed(2)}</td>
              <td><button class="account-btn">Delete</button></td>
            </tr>
          `).join("")}
        </tbody>
      `;
      productList.appendChild(table);
    }
  
    renderUsers(fetchUsers());
    renderProducts(fetchProducts());
  });
  