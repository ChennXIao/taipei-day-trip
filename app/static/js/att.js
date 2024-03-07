let ID = parseInt(window.location.href.slice(36))
import * as loginExports from "./login.js"

let img_page_display;
let profile_img = document.getElementsByClassName("content_img")[0]
let profile_header = document.getElementsByClassName("content_profile-head")[0]
let profile_cat = document.getElementsByClassName("content_profile-cat")[0]
let info_intro = document.getElementsByClassName("info_intro")[0]
let info_address = document.getElementsByClassName("info_address")[0]
let info_transport = document.getElementsByClassName("info_transport")[0]
let pic_order = 0 
let ImageDisplayed = document.createElement('img');
let next_left = document.getElementsByClassName("next_left_pic")[0]
let next_right = document.getElementsByClassName("next_right_pic")[0]
let day_trip = document.querySelectorAll(".circle")[0]
let night_trip = document.querySelectorAll(".circle")[1]
let pay = document.querySelectorAll(".content_profile-booking_fee__payment")[0]
let title = document.getElementsByClassName("navbar-title")[0]

att();

function att(){

    let attration_api = "/api/attraction/"+ ID
    fetch(attration_api).then(response => response.json())
    .then(result => {
      let data2 = result.data
      let name = data2.name
      let mrt = data2.mrt
      let category = data2.category
      let description = data2.description
      let address = data2.address
      let transport = data2.transport
      let images = data2.images
      ImageDisplayed.className = "attraction_pic";
      ImageDisplayed.setAttribute('src', images[pic_order]?images[pic_order]:"data:image/jpeg;base64,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");
      profile_img.appendChild(ImageDisplayed)
      profile_header.textContent = name
      profile_cat.textContent = category+" at "+mrt
      info_intro.textContent = description
      info_address.textContent = address
      info_transport.textContent = transport
      
      for(let i = 0; i<images.length;i++){

        img_page_display = document.querySelectorAll(".img_page_display")[0]
        let img_page_display_circle = document.createElement('div');
        img_page_display_circle.className = "small";
        img_page_display.appendChild(img_page_display_circle)
        }

      img_page_display.childNodes[1].style.backgroundColor  = "black"

      // when clicking the arrow left button, the picture will goes former one 
      next_left.addEventListener("click",()=>{
        pic_order = pic_order-1
        if(pic_order<0){
          pic_order = images.length
          ImageDisplayed.setAttribute('src', images[pic_order-1]);
          img_page_display.childNodes[1].style.backgroundColor  = "white"
          img_page_display.childNodes[images.length].style.backgroundColor  = "black" 
        }else if(pic_order==7){
          ImageDisplayed.setAttribute('src', images[pic_order-1]);
          img_page_display.childNodes[pic_order+1].style.backgroundColor  = "white"
          img_page_display.childNodes[pic_order].style.backgroundColor  = "black"
          pic_order = pic_order-1
        }
        else{
          console.log(pic_order)
          ImageDisplayed.setAttribute('src', images[pic_order]);
          img_page_display.childNodes[pic_order+1+1].style.backgroundColor  = "white"
          img_page_display.childNodes[pic_order+1].style.backgroundColor  = "black"
        }
      })

      // when clicking the arrow right button, the picture will goes next 
      next_right.addEventListener("click",()=>{
        pic_order = pic_order+1
        if(pic_order >=images.length){
          pic_order = 0
          ImageDisplayed.setAttribute('src', images[pic_order]);
          img_page_display.childNodes[pic_order+1].style.backgroundColor  = "black"
          img_page_display.childNodes[images.length].style.backgroundColor  = "white" 
        }else{
          ImageDisplayed.setAttribute('src', images[pic_order]);
          img_page_display.childNodes[pic_order+1-1].style.backgroundColor  = "white"
          img_page_display.childNodes[pic_order+1].style.backgroundColor  = "black"          
        }
      })
      
      day_trip.addEventListener("click",()=>{
        pay.textContent = "新台幣 2000 元"
      })
      night_trip.addEventListener("click",()=>{
        pay.textContent = "新台幣 2500 元"
      })
      title.addEventListener("click",()=>{
        window.location.href= "/"
      })

  
    })
    
    }


let token = localStorage.getItem('token');
console.log(loginExports.member_id)


// deal with order 

let order_btn = document.querySelector(".content_profile-booking_btn")
order_btn.addEventListener("click",()=>{
  if(!loginExports.member_id){
    
    loginExports.loginBoxController(order_btn, null,loginExports.signin_form_box,"block")


}else{
  console.log(day.value,time_)
  if(!day.value && !time_){

    day_hint.style.display = "block"
    date_hint.style.display = "block"
  }else if(!day.value){
    day_hint.style.display = "none"
    date_hint.style.display = "block"

  }else if(!time_){
    day_hint.style.display = "block"
    date_hint.style.display = "none"

  }else{
    window.location.href= "/booking"
    console.log(day.value,pay_,typeof(time_));
    pay_ = pay.textContent
    let url = "/api/booking"
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          "attractionId": ID ,
          "date": day.value,
          "time": time_,
          "price": pay_})
      })
        
    .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
    .then(result => {
      console.log(result)
  
    })
  }}
})

let date_hint = document.querySelector(".content_profile-booking_day-hint")
let day_hint = document.querySelector(".content_profile-booking_choice-hint")

//date
let day = document.querySelector(".content_profile-booking_day__blank")
day.addEventListener("change",()=>{
  console.log(day.value)
})

//time
let time = document.querySelectorAll(".circle")
let time_;
let pay_; 
time.forEach((element) => {
  element.addEventListener("click", () => {
    time_ = element.nextSibling.textContent
    console.log(element.nextSibling.textContent);
    
  });
});


