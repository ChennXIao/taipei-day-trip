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