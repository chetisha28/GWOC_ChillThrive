function toggleMenu() {
    document.querySelector(".hb").classList.toggle("show");
  }

const API_BASE = 'http://localhost:3000/api';
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");
const sendBtn= document.getElementById("enter")
const errorMsg = document.getElementById("errorMsg")

function checkForm() {
  const allFilled =
    nameInput.value.trim() !== "" &&
    emailInput.value.trim() !== "" &&
    message.value.trim() !== "" ;
    
  sendBtn.disabled = !(allFilled);
}

[nameInput, emailInput,message]
  .forEach(input => {
    input.addEventListener("input", checkForm);
  });

sendBtn.addEventListener('click',async(e)=>{
  e.preventDefault();
  errorMsg.textContent = '';
  errorMsg.style.color = "red";
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const msg = message.value.trim();
  sendBtn.disabled=true
  const response = await fetch(`${API_BASE}/contact/feedback`,{
    method : "POST",
    headers : {
      'content-type' : 'application/json',
    },
    body : JSON.stringify({
      name,
      email,
      message : msg
    })
  });
  const data = await response.json();
  if(data.success){
    errorMsg.textContent='SUCCESSFULLY SEND FEEDBACK';
    errorMsg.style.color = 'green';
    nameInput.value = '';
    emailInput.value = '';
    message.value = '';
  }else {
      sendBtn.disabled = 'false';
      errorMsg.textContent = data.message || "not found"
    }
});