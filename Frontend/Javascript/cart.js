document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items-container");
    const totalItemsElem = document.getElementById("total-items");
    const totalPriceElem = document.getElementById("total-price");
  
    // Placeholder: fetch cart data from backend when ready
    fetchCartData().then(cartData => {
      if (!cartData || cartData.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is currently empty.</p>";
        return;
      }
  
      renderCartItems(cartData);
      updateCartSummary(cartData);
    }).catch(err => {
      console.error("Failed to fetch cart data:", err);
      cartContainer.innerHTML = "<p>Error loading your cart. Please try again later.</p>";
    });
  
    document.getElementById("checkout-btn").addEventListener("click", () => {
      alert("");// do checkout function
    });
  });
  
  async function fetchCartData() {
    // fill with real API call later
    return [];
  }
  
  function renderCartItems(cartItems) {
    const cartContainer = document.getElementById("cart-items-container");
    cartContainer.innerHTML = "";
  
    cartItems.forEach(item => {
      const itemElem = document.createElement("div");
      itemElem.classList.add("cart-item");
  
      itemElem.innerHTML = `
        <h3>${item.title}</h3>
        <p>Price: $${item.price.toFixed(2)}</p>
        <p>Quantity: ${item.quantity}</p>
      `;
  
      cartContainer.appendChild(itemElem);
    });
  }
  
  function updateCartSummary(cartItems) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    document.getElementById("total-items").textContent = totalItems;
    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
  }
  