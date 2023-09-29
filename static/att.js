let ID = parseInt(window.location.href.slice(35))

import * as loginExports from "/static/login.js"


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
      ImageDisplayed.setAttribute('src', images[pic_order]);
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
          "id":loginExports.member_id,
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


