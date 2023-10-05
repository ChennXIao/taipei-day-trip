const order_id = localStorage.getItem('order_id');
console.log(order_id);
let orderId = document.querySelector(".thank_order_id")
orderId.textContent = order_id


let title = document.getElementsByClassName("navbar-title")[0]
title.addEventListener("click",()=>{
  window.location.href= "/"
})

let url = "/api/order/"+ order_id

let token = localStorage.getItem('token');

fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
.then(response => response.json())
.then(result => {
  console.log(result)

})

//detect if the web store the token right now or not
let signin_state = document.querySelector(".navbar-btn_signin")

if (token) {
    signin_state.textContent = "登出系統"
    fetch("/api/user/auth", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    }) .then(response => response.json())
    .then(result => {
  
      if(result.error){
        localStorage.removeItem("token");
        window.location.href = "/";
      };
    })
  
  } else {
    window.location.href = "/";
  }
  