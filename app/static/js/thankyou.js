let orderId = document.querySelector(".thank_order_id");
let query_string = window.location.search;
let extracted_num = query_string.slice(query_string.indexOf("=") + 1);
let url = "/api/order/" + extracted_num;
let token = localStorage.getItem("token");
orderId.textContent = extracted_num;

fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
  });

//detect if the web store the token right now or not
let signin_state = document.querySelector(".navbar-btn_signin");

if (token) {
  signin_state.textContent = "登出系統";
  fetch("/api/user/auth", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.error) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    });
} else {
  window.location.href = "/";
}

let title = document.getElementsByClassName("navbar-title")[0];
title.addEventListener("click", () => {
  window.location.href = "/";
});
