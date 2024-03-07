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
      info_image.setAttribute('src', info_data.attraction.image?info_data.attraction.image:"data:image/jpeg;base64,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");
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
let order_num; 


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
  TPDirect.card.getPrime(async(result) => {
    if (result.status !== 0) {
        console.log(result)

    }else{
      console.log(result.card.prime)
      prime = result.card.prime
      // setTimeout(order_api_fetch,500)
      order_api_fetch().then((order_num) => {
        console.log(order_num);
        window.location.href = "/thankyou" + "?number=" + order_num;
    });
        console.log(order_num)
    }
})
  }
})


// async function order_api_fetch(){
//   fetch("/api/orders",{
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       "prime": prime,
//       "order": {
//         "price": fee_value.textContent,
//         "trip": {
//           "attraction": {
//             "id": orderId,
//             "name": attraction_name.textContent,
//             "address": location_value.textContent,
//             "image": info_image_src
//           },
//           "date": date_value.textContent,
//           "time": time_value.textContent,
//         },
//         "contact": {
//           "name": userInfo.name,
//           "email": userInfo.email,
//           "phone": user_phone.value
//         }
//       }
//     })

//   })  
//   .then(response => response.json())
//   .then(result => {
//       order_num = result.data.number
//       console.log(order_num)
//       localStorage.setItem('order_id', order_num);
//       return order_num

//  })
// }


async function order_api_fetch() {
  try {
      const response = await fetch("/api/orders", {
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
      });

      let result = await response.json();
      let order_num = result.data.number;

      return order_num;
  } catch (error) {
      console.error(error);
      throw error; // Re-throw the error for further handling if needed
  }
}