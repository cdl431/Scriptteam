let db;

// Initialize the database only after SQL.js is fully loaded
function initDatabase() {
  if (window.SQL) {
    const SQL = window.SQL;
    db = new SQL.Database();

    // Create users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        userID INTEGER PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        role TEXT
      );
    `;
    db.run(createTableQuery);
  } else {
    console.error("SQL.js is not loaded properly.");
  }
}

// Initialize database
initDatabase();

// Utility function to save user data into localStorage (mock login)
function loginUser(userData) {
  localStorage.setItem("user", JSON.stringify(userData));
}

function logoutUser() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function isUserLoggedIn() {
  return !!localStorage.getItem("user");
}

function getCurrentUser() {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Call the login function
      loginRequest(username, password);
    });
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const phone = document.getElementById('phone').value;
      const role = document.getElementById('role').value;

      if (firstName && lastName && username && email && password && phone && role) {
        // Proceed to insert the new user into the database
        signupRequest(firstName, lastName, username, email, password, phone, role);
      } else {
        document.getElementById('error-message').style.display = 'block';
      }
    });
  }
});

// Function to handle login request
function loginRequest(username, password) {
  // Query the database to find the user by username and password
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const stmt = db.prepare(query);
  stmt.bind([username, password]);

  let user = null;
  while (stmt.step()) {
    user = stmt.getAsObject();
  }
  stmt.free();

  if (user) {
    alert('Login successful!');
    loginUser(user); // Store the user info
    window.location.href = 'HomePage.html';
  } else {
    alert('Invalid username or password.');
    document.getElementById('error-message').style.display = 'block';
  }
}

// Function to handle signup request
function signupRequest(firstName, lastName, username, email, password, phone, role) {
  // Check if the username or email already exists
  const checkUserQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  const checkStmt = db.prepare(checkUserQuery);
  checkStmt.bind([username, email]);

  let existingUser = null;
  while (checkStmt.step()) {
    existingUser = checkStmt.getAsObject();
  }
  checkStmt.free();

  if (existingUser) {
    alert('Username or email already in use.');
  } else {
    // Insert new user data into the database
    const insertQuery = `
      INSERT INTO users (firstName, lastName, username, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const insertStmt = db.prepare(insertQuery);
    insertStmt.bind([firstName, lastName, username, email, password, phone, role]);
    insertStmt.step();
    insertStmt.free();

    // Save DB to localStorage
    const binaryArray = db.export();
    const base64Db = btoa(String.fromCharCode(...binaryArray));
    localStorage.setItem("userDatabase", base64Db);

    alert('Sign up successful!');
    window.location.href = 'login.html'; // Redirect to login after successful signup
  }
}
