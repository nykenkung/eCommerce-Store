window.addEventListener("load", () => {
  alert(
    "\nMessage from 3140 Clothing Brand:\n\nDon't forget to login for exclusive promotion!\n\nSign in to claim your promotional offer today!"
  );
});

// Handle Register Form
document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();

  if (firstName && lastName) {
    alert(`Thank you for registration, ${firstName} ${lastName}!`);
  } else {
    alert("Please enter your full name to register.");
  }
});

// Handle Login Form
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (email && password) {
    alert("Login successfully, welcome back!");
  } else {
    alert("Please enter both email and password.");
  }
});