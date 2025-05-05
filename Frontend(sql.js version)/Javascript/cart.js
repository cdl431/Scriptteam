
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cart-items");
  const totalEl   = document.getElementById("cart-total");
  const checkout  = document.getElementById("checkout-btn");


  let cart = JSON.parse(localStorage.getItem("cart") || "[]");


  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    checkout.disabled   = true;
    totalEl.textContent = "0.00";
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)} × ${item.qty} = $${lineTotal.toFixed(2)}</p>
      </div>
      <button class="remove-btn" data-index="${idx}">Remove</button>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);

  container.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      cart.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.reload();
    });
  });

 
  checkout.addEventListener("click", () => {
    if (!confirm("Proceed to checkout and clear your cart?")) return;
    localStorage.removeItem("cart");
    alert("Thanks for your purchase!\nYour cart is now empty.");
    window.location.reload();
  });
});
