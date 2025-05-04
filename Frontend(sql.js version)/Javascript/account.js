let db;

document.addEventListener("DOMContentLoaded", async () => {
  const SQL = await initSqlJs({ locateFile: file => `Javascript/${file}` });

  if (localStorage.getItem("userDatabase")) {
    const savedDb = Uint8Array.from(JSON.parse(localStorage.getItem("userDatabase")));
    db = new SQL.Database(savedDb);
  } else {
    db = new SQL.Database(); 
    saveDatabase();
  }

  setupPage();
});

function saveDatabase() {
  const data = db.export();
  localStorage.setItem("userDatabase", JSON.stringify(Array.from(data)));
}

function setupPage() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const greeting = document.getElementById("greeting");
  const logoutBtn = document.getElementById("logout-btn");

  const usernameSpan = document.getElementById("userUsername");
  const emailSpan = document.getElementById("userEmail");

  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");

  if (user) {
    greeting.textContent = `Welcome, ${user.firstName}!`;
    usernameSpan.textContent = user.username;
    emailSpan.textContent = user.email;

    if (usernameInput) usernameInput.value = user.username;
    if (emailInput) emailInput.value = user.email;
    if (phoneInput) phoneInput.value = user.phone || "";
    if (passwordInput) passwordInput.value = user.password || "";
  } else {
    greeting.textContent = "Welcome, Guest";
    usernameSpan.textContent = "[Not logged in]";
    emailSpan.textContent = "[No email]";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }

  const editProfileBtn = document.getElementById("edit-profile-btn");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      document.getElementById("editProfileForm").style.display = "block";
    });
  }

  const cancelEditBtn = document.getElementById("cancelEditBtn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      document.getElementById("editProfileForm").style.display = "none";
    });
  }

  const editForm = document.getElementById("editProfileForm");
  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

      console.log("Form submitted!");

      if (!user) return;

      const originalUsername = user.username;

      const updatedUser = {
        ...user,
        username: usernameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        password: passwordInput.value
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      const updateStmt = db.prepare(`
        UPDATE users
        SET username = ?, email = ?, phone = ?, password = ?
        WHERE username = ?
      `);
      updateStmt.bind([
        updatedUser.username,
        updatedUser.email,
        updatedUser.phone,
        updatedUser.password,
        originalUsername
      ]);
      updateStmt.step();
      updateStmt.free();
      saveDatabase();

      usernameSpan.textContent = updatedUser.username;
      emailSpan.textContent = updatedUser.email;

      document.getElementById("editProfileForm").style.display = "none";

      alert("Profile updated successfully!");
    });
  }
}



