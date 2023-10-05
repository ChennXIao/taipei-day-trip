const lastPageUrl = document.referrer;
let orderId = lastPageUrl.slice(33)
let url = "/api/booking"
let token = localStorage.getItem('token');

fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(result => {
    if(result.data){
      info_image.setAttribute('src', result.data.attraction.image);
      attraction_name.textContent = result.data.attraction.name
      date_value.textContent = result.date
      time_value.textContent = result.time
      fee_value.textContent = result.price
      location_value.textContent = result.data.attraction.address
      total_value.textContent = result.price
    }else{
      // main.innerHTML = ""
      let visibleDivs = document.querySelectorAll('.main div:not(.main_title, .main_info)');
      visibleDivs.forEach((element) => {
        element.style.display = 'none'; // Hide each main_title element
      
      });
      main.textContent = "目前沒有預定行程\n 快前往預定"
    }

})
let main = document.querySelector(".main_info")
let main_title = document.querySelector(".main_title")

let info_image = document.querySelector(".main_info-image")
let attraction_name = document.querySelector(".attraction_name")

let date_value = document.querySelector(".main_info_text__date-value")
let time_value = document.querySelector(".main_info_text__time-value")
let fee_value = document.querySelector(".main_info_text__fee-value")
let location_value = document.querySelector(".main_info_text__location-value")
let total_value = document.querySelector(".main_payment_total-value")



let signin_state = document.querySelector(".navbar-btn_signin")

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

    // booking render the user info on page
    userInfo = result.data
    user_name.textContent = userInfo.name
    info_name.value = userInfo.name
    user_mail.value = userInfo.email

    console.log(result.data)
    if(result.error){
    console.log(result.error)
    localStorage.removeItem("token");
    window.location.href = "/";
    };
  })

} else {
  window.location.href = "/";
  console.log('Token not found in localStorage');
}

//define the user info variable
let userInfo;
let user_name = document.querySelector(".username")
let info_name = document.querySelector(".main_user_name_box")
let user_mail = document.querySelector(".main_user_email_box")



let delete_btn = document.querySelector(".delete_btn")
delete_btn.addEventListener("click",()=>{
  let url = "/api/booking"
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  }) 
  .then(response => response.json())
  .then(result => {
      console.log(result)
      window.location.href = window.location.href;

 })
})


let title = document.getElementsByClassName("navbar-title")[0]
title.addEventListener("click",()=>{
  window.location.href= "/"
})