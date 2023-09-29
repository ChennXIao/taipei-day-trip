//sign up form

let signupForm = document.querySelector(".signup_form"); // Select the form element
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(signupForm);
  console.log(formData.get("name"))
  let name = formData.get("name")
  let email = formData.get("email")
  let password = formData.get("password")

  let signup_msg = document.querySelector(".signup_form_msg")
  let url = "/api/user";

  if (name === "" || email === "" || password === ""){
    displayMsg(signup_msg,"姓名、信箱或密碼不可為空白")

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
          displayMsg(signup_msg,"註冊成功!","green")

        } else {
          displayMsg(signup_msg,result.message)
        }
      })
  }


});

//pack the display message
function displayMsg(element, text, color="red"){
  element.style.display = "block";
  element.style.color = color;
  element.textContent = text;
}

//sign in form
let signinForm = document.querySelector(".signin_form"); 
if(signinForm){
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(signinForm);
  let email = formData.get("email")
  let password = formData.get("password")
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
        displayMsg(signin_msg,result.message)

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
let order_state = document.querySelector(".navbar-btn_order")
let signup_form_box = document.querySelector(".signup_form_box")
let switch_to_signin = document.querySelector(".signup_form_switch")
let switch_to_signup = document.querySelector(".signin_form_switch")
let signin_form_box = document.querySelector(".signin_form_box")
let signup_form_closing = document.querySelector(".signup_form_closing")
let signin_form_closing = document.querySelector(".signin_form_closing")
let mask = document.querySelector(".mask")

loginBoxController(signin_state, null,signin_form_box,"block")
loginBoxController(switch_to_signin, signup_form_box,signin_form_box, "block")
loginBoxController(switch_to_signup, signin_form_box,signup_form_box, "block")
loginBoxController(signup_form_closing, signup_form_box,null,"none")
loginBoxController(signin_form_closing, signin_form_box,null,"none")

export function loginBoxController(clickedItem, FadeOutItem=null,FadeInItem=null,maskShowed){
  clickedItem.addEventListener("click",()=>{
    if (token) {
      localStorage.removeItem("token");
      window.location.href = window.location.href; 
    }else{
      if (FadeOutItem) {
        FadeOutItem.style.top="-500px"
      }
      if (FadeInItem) {
        FadeInItem.style.top = "80px";
      }
      mask.style.display=maskShowed
    }
  })
}


order_state.addEventListener("click",()=>{
  if(member_id){
    window.location.href = "/booking";
  }else{
    loginBoxController(order_state, null,signin_form_box,"block")
  }
})
// let member_id
//detect if the web store the token right now or not
// function login_check(){
//   let token = localStorage.getItem('token');
//   let signin_state = document.querySelector(".navbar-btn_signin")
//   if (token) {
//       console.log('Token:', token);
//       signin_state.textContent = "登出系統"
//       fetch("/api/user/auth", {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}` 
//         }
//       }) .then(response => response.json())
//       .then(result => {
//         member_id = result.data.email
        

//         // if(result.error){
//         // console.log(result.error)
//         // localStorage.removeItem("token");
//         // window.location.href = "/";
//         // };
        
//       })
//       return true;
//     } else {
//       return false;
//     }
// }



async function login_check() {
  let token = localStorage.getItem('token');
  let signin_state = document.querySelector(".navbar-btn_signin");

  if (!token) {
    
    return false;
  }else{

  console.log('Token:', token);
  signin_state.textContent = "登出系統";
  
  try {
    let response = await fetch("/api/user/auth", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    let result = await response.json();
    let id = result.data.id;
    return id;
  } catch (error) {
    console.error("Error:", error);
  }
}
}



let member_id = await login_check();
console.log(member_id)


export { login_check,signin_state,signin_form_box,member_id };