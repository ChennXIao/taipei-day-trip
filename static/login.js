//sign up form

let signupForm = document.querySelector(".signup_form"); // Select the form element

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = document.querySelector(".name").value;
  let email = document.querySelector(".email").value;
  let password = document.querySelector(".password").value;
  let signup_msg = document.querySelector(".signup_form_msg")
  let url = "/api/user";

  if (name === "" || email === "" || password === ""){
    signup_msg.style.display = "block";
    signup_msg.style.color = "red";
    signup_msg.textContent = "姓名、信箱或密碼不可為空白"
  }else{
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "name": name, "email": email, "password": password })
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result.ok) {
          signup_msg.style.display = "block";
          signup_msg.style.color = "green";
          signup_msg.textContent = "註冊成功!"
        } else {
          signup_msg.style.display = "block";
          signup_msg.style.color = "red";
          signup_msg.textContent = result.message
        }
      })
  }


});

//sign in form
let signinForm = document.querySelector(".signin_form"); 
if(signinForm){
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.querySelectorAll(".email")[1].value;
  let password = document.querySelectorAll(".password")[1].value;
  let signin_msg = document.querySelector(".signin_form_msg")
  let url = "/api/user/auth";

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"email": email, "password": password})
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      if (result.error) {
        console.log(result.error)
        signin_msg.style.display = "block";
        signin_msg.style.color = "red";
        signin_msg.textContent = result.message
// Redirect if the registration was successful
      } else {
        window.location.href = window.location.href; 
        localStorage.setItem("token", result.token);
      }
    })
});

}

let token = localStorage.getItem('token');
let signin_state = document.querySelector(".navbar-btn_signin")
let signup_form_box = document.querySelector(".signup_form_box")
let switch_to_signin = document.querySelector(".signup_form_switch")
let switch_to_signup = document.querySelector(".signin_form_switch")
let signin_form_box = document.querySelector(".signin_form_box")
let signup_form_closing = document.querySelector(".signup_form_closing")
let signin_form_closing = document.querySelector(".signin_form_closing")
let mask = document.querySelector(".mask")

//sign out box appear
signin_state.addEventListener("click",()=>{
  if (token) {
  localStorage.removeItem("token");
  window.location.href = window.location.href; 
  }else{
  signin_form_box.style.display="block"
  signin_form_box.style.top="80px"

  mask.style.display="block"
  // Set the opacity of the "signup_form_box" div
  signup_form_box.style.opacity = "1";
  }
})

switch_to_signin.addEventListener("click",()=>{
  signup_form_box.style.top="-500px"
  signin_form_box.style.top="80px",5000
  mask.style.display="block"

})

switch_to_signup.addEventListener("click",()=>{
  signin_form_box.style.top="-500px"
  signup_form_box.style.top="80px"
  mask.style.display="block"

})
signup_form_closing.addEventListener("click",()=>{
  signup_form_box.style.top="-500px"
  mask.style.display="none"

})
signin_form_closing.addEventListener("click",()=>{
  signin_form_box.style.top="-500px"
  mask.style.display="none"

})


//detect if the web store the token right now or not
if (token) {
  console.log('Token:', token);
  signin_state.textContent = "登出系統"
  fetch("/api/user/auth", {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  }) .then(response => response.json())
  .then(result => {
    console.log(result.data)
    if(result.error){
    console.log(result.error)
    localStorage.removeItem("token");
    window.location.href = "/";
    };
  })

} else {
  console.log('Token not found in localStorage');
}

