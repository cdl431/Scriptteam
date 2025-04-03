document.addEventListener("DOMContentLoaded", () => {
    // Simulated user object until backend has data
    const mockUser = {
      name: "John Doe",
      email: "johndoe@example.com"
    };
  
    if (!localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify(mockUser));
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (user) {
      const welcomeText = document.querySelector(".account-section h2");
      const emailText = document.querySelector(".account-section p");
  
      if (welcomeText) welcomeText.textContent = `Welcome, ${user.name}`;
      if (emailText) emailText.textContent = `Email: ${user.email}`;
    }
  
    const logoutBtn = document.querySelector(".account-btn.logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      });
    }
  
    const editBtn = document.querySelector(".account-btn.edit");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        alert("Edit profile functionality coming soon!");
      });
    }
  });
  