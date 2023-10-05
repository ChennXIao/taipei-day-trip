const lastPageUrl = document.referrer;
let orderId;
let url = "/api/booking"
let token = localStorage.getItem('token');
let info_data;
fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(result => {
    if(result.data){
      info_data = result.data
      info_image.setAttribute('src', info_data.attraction.image);
      attraction_name.textContent = info_data.attraction.name
      date_value.textContent = info_data.date
      time_value.textContent = info_data.time
      fee_value.textContent = info_data.price
      location_value.textContent = info_data.attraction.address
      total_value.textContent = info_data.price
      orderId = info_data.attraction.id
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
let user_phone = document.querySelector(".main_user_phone_box")




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


TPDirect.setupSDK(137080, 'app_VsPZEH9GV2oGxdW1bDlwPrHYETtpZPbgsqCYSojzEnAyGSMzceRMz8bPJFM8', 'sandbox')



// 必填 CCV Example
let fields = {
  number: {
      // css selector
      element: '#card-number',
      placeholder: '**** **** **** ****'
  },
  expirationDate: {
      // DOM object
      element: document.getElementById('card-expiration-date'),
      placeholder: 'MM / YY'
  },
  ccv: {
      element: '#card-ccv',
      placeholder: 'ccv'
  }
}
TPDirect.card.setup({
  fields: fields,
  styles: {
      // Style all elements
      'input': {
          'color': 'gray'
      },
      '.valid': {
          'color': 'green'
      },
      '.invalid': {
          'color': 'red'
      },
      '@media screen and (max-width: 400px)': {
          'input': {
              'color': 'orange'
          }
      }
  },
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
      beginIndex: 6, 
      endIndex: 11
  }
})

let prime;
let foam = document.querySelector(".main_credit_form")
let info_image_src = info_image.getAttribute("src");


foam.addEventListener("submit", (event) => {
  event.preventDefault()
  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus()
  let user_phone_hint = document.querySelector(".main_user_phone-hint")
  let credit_hint = document.querySelector(".main_credit-hint")
  if(user_phone.value == "" && tappayStatus.canGetPrime === false){
    user_phone_hint.style.display = "block"
    credit_hint.style.display = "block"


  }else if(user_phone.value == ""){
    credit_hint.style.display = "none"

    user_phone_hint.style.display = "block"

  }else if (tappayStatus.canGetPrime === false) {
    credit_hint.style.display = "block"
    user_phone_hint.style.display = "none"

    }else{
    console.log("get prime successfully!")
      // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
        console.log(result)

    }else{
      console.log(result.card.prime)
      prime = result.card.prime
      setTimeout(order_api_fetch,500)
      setTimeout(()=>{
        window.location.href = "/thankyou"+"?number="+order_num
      },2000)
    }
})
  }
})


let order_num; 

function order_api_fetch(){
  fetch("/api/orders",{
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "prime": prime,
      "order": {
        "price": fee_value.textContent,
        "trip": {
          "attraction": {
            "id": orderId,
            "name": attraction_name.textContent,
            "address": location_value.textContent,
            "image": info_image_src
          },
          "date": date_value.textContent,
          "time": time_value.textContent,
        },
        "contact": {
          "name": userInfo.name,
          "email": userInfo.email,
          "phone": user_phone.value
        }
      }
    })

  })  
  .then(response => response.json())
  .then(result => {
      order_num = result.data.number
      console.log(order_num)
      localStorage.setItem('order_id', order_num);

 })
}


