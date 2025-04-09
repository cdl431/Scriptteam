export function loginUser(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  }
  
  export function logoutUser() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
  
  export function isUserLoggedIn() {
    return !!localStorage.getItem("user");
  }
  
  export function getCurrentUser() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
  