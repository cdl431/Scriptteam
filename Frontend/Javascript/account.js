import { logoutUser } from "./auth.js";
import { isUserLoggedIn, getCurrentUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // Simulated user object until backend has data
  const mockUser = {
    name: "random guy",
    email: "randomguy@example.com"
  };

  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify(mockUser));
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const welcomeText = document.querySelector(".account-section h2");
  const emailText = document.querySelector(".account-section p");

  if (user && welcomeText && emailText) {
    welcomeText.textContent = `Welcome, ${user.name}`;
    emailText.textContent = `Email: ${user.email}`;
  }

  const logoutBtn = document.querySelector(".account-btn.logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }

  const editBtn = document.getElementById("edit-profile-btn");
  const editForm = document.getElementById("editProfileForm");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  if (editBtn && editForm) {
    editBtn.addEventListener("click", () => {
      editForm.style.display = "block";
      document.getElementById("username").value = user.name;
      document.getElementById("email").value = user.email;
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      editForm.style.display = "none";
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newName = document.getElementById("username").value.trim();
      const newEmail = document.getElementById("email").value.trim();

      if (!newName || !newEmail) {
        alert("Please fill out all fields.");
        return;
      }

      const updatedUser = { name: newName, email: newEmail };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update the UI
      if (welcomeText) welcomeText.textContent = `Welcome, ${newName}`;
      if (emailText) emailText.textContent = `Email: ${newEmail}`;
      editForm.style.display = "none";

      alert("Profile updated!");
    });
  }
});
