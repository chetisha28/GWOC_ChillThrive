const API_BASE = 'http://localhost:3000/api';

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const registerBtn = document.getElementById("register");
const errorMsg = document.getElementById("errorMsg");

function checkForm() {
  const allFilled =
    nameInput.value.trim() !== "" &&
    emailInput.value.trim() !== "" &&
    passwordInput.value.trim() !== "" &&
    confirmPasswordInput.value.trim() !== "";

  const passwordsMatch =
    passwordInput.value === confirmPasswordInput.value;

  if (!passwordsMatch && confirmPasswordInput.value !== "") {
    errorMsg.textContent = "Passwords do not match ❌";
    errorMsg.style.color = "red";
  } else {
    errorMsg.textContent = "";
  }
  registerBtn.disabled = !(allFilled && passwordsMatch);
}

[nameInput, emailInput, passwordInput, confirmPasswordInput]
  .forEach(input => {
    input.addEventListener("input", checkForm);
  });

const toggles = document.querySelectorAll(".togglePassword");

toggles.forEach(toggle => {
  toggle.addEventListener("click", () => {

    const inputId = toggle.getAttribute("data-target");
    const passwordInput = document.getElementById(inputId);

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggle.src = "images/eye-close.png";
    } else {
      passwordInput.type = "password";
      toggle.src = "images/eye-open.png";
    }
  });
});

registerBtn.addEventListener("click", async function(e) {
  e.preventDefault();
  
  errorMsg.textContent = "";
  errorMsg.style.color = "red";

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords do not match";
    return;
  }
  
  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters";
    return;
  }
  registerBtn.disabled = true;
  const originalBtnText = registerBtn.textContent;
  registerBtn.textContent = "Registering...";
  
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      errorMsg.style.color = "green";
      errorMsg.textContent = "Registration successful";
      
      setTimeout(() => {
        // Smart redirection logic - but default to homepage for clean registration
        const returnUrl = localStorage.getItem('returnUrl');
        if (returnUrl && returnUrl !== 'services.html') {
          localStorage.removeItem('returnUrl');
          window.location.href = returnUrl;
        } else {
          // Clear any existing returnUrl and go to homepage
          localStorage.removeItem('returnUrl');
          window.location.href = 'homepage.html';
        }
      }, 300);
      
    } else {
      errorMsg.textContent = data.message || "Registration failed! ❌";
      registerBtn.disabled = false;
      registerBtn.textContent = originalBtnText;
    }
    
  } catch (error) {
    console.error('Registration Error:', error);
    errorMsg.textContent = "Network error. Please check your connection! ❌";
    registerBtn.disabled = false;
    registerBtn.textContent = originalBtnText;
  }
});
