const API_BASE = 'http://localhost:3000/api';

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signinBtn = document.getElementById("signin");

function checkForm(){
    const allFilled=
    emailInput.value.trim() !=="" &&
    passwordInput.value.trim() !=="";
    
    signinBtn.disabled = !(allFilled);
}

[emailInput, passwordInput]
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

signinBtn.addEventListener("click", async function(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }
  
  signinBtn.disabled = true;
  const originalBtnText = signinBtn.textContent;
  signinBtn.textContent = "Signing In...";
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert("Login successful! Welcome back!");
      
      // Smart redirection logic - but default to homepage for clean login
      const returnUrl = localStorage.getItem('returnUrl');
      if (returnUrl && returnUrl !== 'services.html') {
        localStorage.removeItem('returnUrl');
        window.location.href = returnUrl;
      } else {
        // Clear any existing returnUrl and go to homepage
        localStorage.removeItem('returnUrl');
        window.location.href = 'homepage.html';
      }
      
    } else {
      alert(data.message || "Login failed! Please check your credentials.");
      signinBtn.disabled = false;
      signinBtn.textContent = originalBtnText;
    }
    
  } catch (error) {
    console.error('Login Error:', error);
    alert("Network error. Please check your connection and try again.");
    signinBtn.disabled = false;
    signinBtn.textContent = originalBtnText;
  }
});
