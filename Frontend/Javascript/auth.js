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


  // Add an event listener to handle form submission
  document.getElementById('login-form').addEventListener("DOMContentLoaded", 'submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting the traditional way

    // Collect the form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulate sending data to the C++ backend (for now, it's a mock function)
    loginRequest(username, password);
  });

  // Mock function to simulate sending login data to the C++ backend
  function loginRequest(username, password) {
    // Simulate a delay (like waiting for a server response)
    setTimeout(() => {
      // Example mock response
      const mockResponse = simulateLoginBackend(username, password);
      
      if (mockResponse === 'approve') {
        // If approved, redirect to the next page (or change behavior accordingly)
        alert('Login successful!');
        window.location.href = 'HomePage.html';  // Redirect to the homepage or dashboard
      } else {
        // If denied, show an error message
        alert('Login unsuccessful...');
        document.getElementById('error-message').style.display = 'block';
      }
    }, 1000);  // Simulate network delay
  }

  // Simulate the behavior of the C++ backend validating the login
  function simulateLoginBackend(username, password) {
    // For the purpose of the mock, use a simple check
    // Replace this with real server-side logic later
    if (username === 'testuser' && password === 'testpass') {
      return 'approve';  // Simulate approved login
    } else {
      return 'deny';  // Simulate denied login
    }
  }

  // Handle form submission
  document.getElementById('signup-form').addEventListener("DOMContentLoaded", 'submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting the traditional way

    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Check if all fields are filled
    if (username && email && password) {
      // Hide any previous error message
      document.getElementById('error-message').style.display = 'none';

      // Send the data to the C++ backend (simulated with a mock function here)
      signupRequest(username, email, password);
    } else {
      // Display an error message if any field is empty
      document.getElementById('error-message').style.display = 'block';
    }
  });

  // Simulate sending the data to the C++ backend (replace with real API call later)
  function signupRequest(username, email, password) {
    // Simulate a delay to mimic a server response (like fetching data from a C++ backend)
    setTimeout(() => {
      // Mock response from server (for now we'll mock the success response)
      const mockResponse = simulateSignupBackend(username, email, password);
      
      if (mockResponse === 'success') {
        // Redirect or show a success message if signup is successful
        alert('Sign up successful! Redirect to login...');
      } else {
        // Handle failure (for instance, if the username already exists)
        alert('Error: Username or Email already in use!');
      }
    }, 1000);  // Simulate network delay
  }

  // Simulate the backend logic (in the real case, replace with a backend API request)
  function simulateSignupBackend(username, email, password) {
    // Mock validation - for example, check if username is already "taken"
    if (username === 'existinguser') {
      return 'error';  // Simulate a failure if the username already exists
    } else {
      return 'success';  // Simulate successful signup
    }
  }