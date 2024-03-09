let api = "/api/attractions" + "?page=" + 0;
let input;
let nextPage;
let time;
let isScrolling = false;
let data;
let click;
let clicking;
const targetElement = document.querySelector(".footer");

document.addEventListener("DOMContentLoaded", function () {
  fetch_data();
  get_input();
  fetch_mrt();
  mrt_scroll();
  setTimeout(mrt, 3000);
});

function getAttractionContainer() {
  return document.getElementsByClassName("attraction-container");
}

function getBlankElements() {
  return document.getElementsByClassName("input");
}

function getBlockElements() {
  return document.getElementsByClassName("block");
}

// function get_clicked() {
//   let BLOCK = getBlockElements();
//   for (let i = 0; i < BLOCK.length; i++) {
//     BLOCK[i].style.cursor = "pointer";
//     BLOCK[i].addEventListener("click", function (e) {
//       clicking = e.target.id;
//       console.log(clicking);
//       let url = "/attraction/" + clicking;
//       window.location.href = url;
//     });
//   }
// }

function get_input() {
  let query = document.getElementsByClassName("form");
  if (query) {
    query[0].addEventListener("submit", (e) => {
      let container = getAttractionContainer();
      let blank = getBlankElements();
      e.preventDefault();
      input = blank[0].value;
      container[0].innerHTML = "";
      api = "/api/attractions" + "?page=" + 0 + "&" + "keyword=" + input;
      fetch_data();
    });
  }
}

function fetch_data() {
  let nodata_text = document.getElementsByClassName("nodata_text")[0];
  console.log("fetch: " + api);
  fetch(api)
    .then((response) => response.json())
    .then((result) => {
      if (result.error) {
        console.log(result.message);
        nodata_text.style.display = "block";
        nodata_text.textContent = result.message;
      } else {
        let data = result.data;
        nextPage = result.nextPage;
        let container = getAttractionContainer();
        for (let i = 0; i < data.length; i++) {
          let block = document.createElement("div");
          block.className = "block";
          block.setAttribute("id", data[i].id);
          container[0].appendChild(block);

          var lastChild = container[0].lastChild;

          let block_div = document.getElementsByClassName("block");
          let img = document.createElement("img");
          img.className = "pic";
          img.setAttribute(
            "src",
            data[i].images[0]
              ? data[i].images[0]
              : "data:image/jpeg;base64,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"
          );
          img.setAttribute("loading", "lazy");
          img.setAttribute("id", data[i].id);
          lastChild.appendChild(img);

          let block_detail = document.createElement("div");
          block_detail.className = "block-detail";
          block_detail.setAttribute("id", data[i].id);
          lastChild.appendChild(block_detail);

          let block_mrt = document.createElement("div");
          block_mrt.className = "block-mrt";
          block_mrt.setAttribute("id", data[i].id);
          lastChild.appendChild(block_mrt);

          if (lastChild) {
            let f = lastChild.childNodes[1];
            let l = lastChild.lastChild;

            let block_detail_text = document.createElement("div");
            block_detail_text.className = "text";
            block_detail_text.setAttribute("id", data[i].id);
            block_detail_text.textContent = data[i].name;
            f.appendChild(block_detail_text);

            let block_mrt_name = document.createElement("div");
            let block_mrt_cat = document.createElement("div");

            block_mrt_name.className = "block-mrt_name";
            block_mrt_name.setAttribute("id", data[i].id);
            block_mrt_name.textContent = data[i].mrt;
            l.appendChild(block_mrt_name);

            block_mrt_cat.className = "block-mrt_cat";
            block_mrt_cat.textContent = data[i].category;
            block_mrt_cat.setAttribute("id", data[i].id);
            l.appendChild(block_mrt_cat);

            nodata_text.style.display = "none";
          }

          block.style.cursor = "pointer";
          block.addEventListener("click", function (e) {
            clicking = e.target.id;
            console.log(clicking);
            let url = "/attraction/" + clicking;
            window.location.href = url;
          });
        }
      }
    })
    .finally(() => {
      isScrolling = false; // Set isScrolling to false after the API request is completed
    });
}

function fetch_mrt() {
  let mrt_api = "/api/mrts";
  fetch(mrt_api)
    .then((response) => response.json())
    .then((result) => {
      let data = result.data;
      for (let i = 0; i < data.length; i++) {
        let listItemcontainer =
          document.getElementsByClassName("listItemcontainer");
        let list = document.createElement("div");
        list.className = "list";
        list.textContent = data[i];
        list.setAttribute("v", data[i]);
        listItemcontainer[0].appendChild(list);
      }
    });
}

function mrt() {
  let lll = document.getElementsByClassName("list");
  for (let i = 0; i < lll.length; i++) {
    lll[i].style.cursor = "pointer";
    lll[i].addEventListener("click", function (e) {
      let container = getAttractionContainer();
      let blank = getBlankElements();
      container[0].innerHTML = "";
      click = e.target.getAttribute("v");
      blank[0].value = click;
      input = click;
      api = "/api/attractions" + "?page=" + 0 + "&" + "keyword=" + input;
      fetch_data();
    });
  }
}

function mrt_scroll() {
  let left = document.getElementsByClassName("arrow_left");
  let right = document.getElementsByClassName("right-container");
  let listItemcontainer = document.getElementsByClassName("listItemcontainer");
  left[0].style.cursor = "pointer";
  right[0].style.cursor = "pointer";
  left[0].addEventListener("click", () => {
    listItemcontainer[0].scrollLeft -= 300;
  });

  right[0].addEventListener("click", () => {
    listItemcontainer[0].scrollLeft += 300;
  });
}

function scroll() {
  let pre_scrollPosition = window.scrollY;

  window.addEventListener("load", function () {
    window.scrollTo(0, 0);
  });

  window.addEventListener("scroll", function () {
    let windowHeight = window.innerHeight;
    let documentHeight = document.documentElement.scrollHeight;
    let scrollPosition = window.scrollY;
    if (
      !isScrolling &&
      scrollPosition + windowHeight >= documentHeight &&
      scrollPosition - pre_scrollPosition >= 0
    ) {
      isScrolling = true;
      if (nextPage) {
        if (input) {
          api =
            "/api/attractions" + "?page=" + nextPage + "&" + "keyword=" + input;
        } else {
          api = "/api/attractions" + "?page=" + nextPage + "&" + "keyword=";
        }
        clearTimeout(time);
        time = setTimeout(function () {
          fetch_data();
        }, 50);
      }
    }
  });
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log("Target element is now in view!");
      if (nextPage && !isScrolling) {
        isScrolling = true;
        api = "/api/attractions" + "?page=" + nextPage + "&" + "keyword=";
        clearTimeout(time);
        time = setTimeout(fetch_data, 100);
      }
    } else {
      //
    }
  });
});

observer.observe(targetElement);
