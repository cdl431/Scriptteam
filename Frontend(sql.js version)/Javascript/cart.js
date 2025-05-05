window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  document.getElementById("checkout-btn")
          .addEventListener("click", handleCheckout);
});

async function handleCheckout() {
  if (!confirm("Proceed to checkout and clear your cart?")) return;

  const SQL = await initSqlJs({ locateFile: f => `Javascript/${f}` });
  const raw = localStorage.getItem("userDatabase");
  if (!raw) return alert("User DB missing!");

  const db = new SQL.Database(Uint8Array.from(JSON.parse(raw)));
  const cart = getCart();

  const payments = {};
  let total = 0;
  cart.forEach(i => {
    payments[i.owner] = (payments[i.owner]||0) + i.price*i.qty;
    total += i.price*i.qty;
  });

  for (let sellerID in payments) {
    const amt = payments[sellerID];
    db.run(
      "UPDATE users SET balance = balance + ? WHERE userID = ?",
      [amt, sellerID]
    );
  }

  const me = JSON.parse(localStorage.getItem("user") || "{}");
  db.run(
    "UPDATE users SET balance = balance - ? WHERE userID = ?",
    [total, me.userID]
  );

  const exported = db.export();
  localStorage.setItem("userDatabase", JSON.stringify(Array.from(exported)));

  me.balance = (me.balance||0) - total;
  localStorage.setItem("user", JSON.stringify(me));

  let msg = `You paid $${total.toFixed(2)}.\n`;
  msg += "Seller payouts:\n";
  for (let sid in payments) {
    msg += `  – $${payments[sid].toFixed(2)} to seller #${sid}\n`;
  }
  alert(msg);

  localStorage.removeItem("cart");
  renderCart();
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cart      = getCart();
  const container = document.getElementById("cart-items");
  const totalEl   = document.getElementById("cart-total");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "0.00";
    document.getElementById("checkout-btn").disabled = true;
    return;
  }

  let sum = 0;
  cart.forEach((item, i) => {
    const lineTotal = item.price * item.qty;
    sum += lineTotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)} × ${item.qty} = $${lineTotal.toFixed(2)}</p>
      </div>
      <button class="remove-btn" data-index="${i}">Remove</button>
    `;
    container.appendChild(row);
  });

  totalEl.textContent = sum.toFixed(2);
  container.querySelectorAll(".remove-btn")
    .forEach(btn => btn.addEventListener("click", e => {
      const idx = +e.target.dataset.index;
      const cart = getCart();
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
    }));
}
