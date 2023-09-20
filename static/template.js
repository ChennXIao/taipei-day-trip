let api = "/api/attractions"+"?page="+0;
let input;
let nextPage;
let time;
let isScrolling = false;
let data;
let click;
let clicking;
document.addEventListener('DOMContentLoaded', function() {
  fetch_data();
  get_input();
  fetch_mrt();
  setTimeout(mrt, 1000); 
  mrt_scroll();
  setTimeout(scroll, 300); 
  setTimeout(get_clicked, 300); 
  
});

function getAttractionContainer() {
  return document.getElementsByClassName("attraction-container");
}


function getBlankElements() {
  return document.getElementsByClassName("input");
}


function get_clicked(){
let BLOCK = getAttractionContainer();
for (let i = 0; i < BLOCK.length; i++) {
  
  BLOCK[i].style.cursor = "pointer";
  BLOCK[i].addEventListener("click", function (e) {
    clicking = e.target.id
    console.log(clicking)
    let url = "/attraction/"+clicking
    window.location.href = url
    
    
  })
}
}
function get_input(){

  let query = document.getElementsByClassName("form")
  if(query){

    query[0].addEventListener('submit', (e)=>{
    let container = getAttractionContainer();
    let blank = getBlankElements();
    e.preventDefault();
    input = blank[0].value
    container[0].innerHTML = "";
    api = "/api/attractions"+"?page="+0+ "&"+"keyword="+input
    fetch_data();
    }
  )
  }
}


function fetch_data(){

  let nodata_text = document.getElementsByClassName("nodata_text")[0]
  console.log("fetch: " + api)
  fetch(api).then(response => response.json())
      .then(result => {
        if(result.error){
          console.log(result.message)
          nodata_text.style.display = "block"
          nodata_text.textContent = result.message
        }else{
          let data = result.data
          nextPage = result.nextPage
          let container = getAttractionContainer();
          for(let i=0;i< data.length; i++){

            let block = document.createElement('div');
            block.className = "block";
            container[0].appendChild(block);
            var lastChild = container[0].lastChild;
            
            let block_div = document.getElementsByClassName("block");
            let img = document.createElement('img');
            img.className = "pic";
            img.setAttribute('src', data[i].images[0]);
            img.setAttribute('id', data[i].id);
            lastChild.appendChild(img);

            let block_detail = document.createElement('div');
            block_detail.className = "block-detail";
            lastChild.appendChild(block_detail);

            let block_mrt = document.createElement('div');
            block_mrt.className = "block-mrt";
            lastChild.appendChild(block_mrt);
            
            if(lastChild){
              let f = lastChild.childNodes[1]
              let l = lastChild.lastChild

              let block_detail_text= document.createElement('div');
              block_detail_text.className = "text";
              block_detail_text.textContent = data[i].name
              f.appendChild(block_detail_text);

              let block_mrt_name = document.createElement('div');
              let block_mrt_cat = document.createElement('div');

              block_mrt_name.className = "block-mrt_name";
              block_mrt_name.textContent = data[i].mrt
              l.appendChild(block_mrt_name);

              block_mrt_cat.className = "block-mrt_cat";
              block_mrt_cat.textContent = data[i].category
              l.appendChild(block_mrt_cat);


              nodata_text.style.display = "none"
            }
          }
        }
        
        }
        
        
        )
        .finally(() => {
          isScrolling = false; // Set isScrolling to false after the API request is completed
        });
        
      }


function fetch_mrt(){

  let mrt_api = "/api/mrts"
  fetch(mrt_api).then(response => response.json())
  .then(
    result => {
      let data = result.data
      for(let i=0;i< data.length; i++){
        let listItemcontainer = document.getElementsByClassName("listItemcontainer")
        let list = document.createElement('div');
        list.className = "list";
        list.textContent = data[i]
        list.setAttribute("v",data[i])
        listItemcontainer[0].appendChild(list);
    }
  }
)
}


function mrt(){
  
  let lll = document.getElementsByClassName("list")
  for (let i = 0; i < lll.length; i++) {
    lll[i].style.cursor = "pointer";
    lll[i].addEventListener("click", function (e) {
      let container = getAttractionContainer();
      let blank = getBlankElements();
      container[0].innerHTML = "";
      click = e.target.getAttribute("v")
      blank[0].value = click;
      input = click;
      api = "/api/attractions"+"?page="+0+ "&"+"keyword="+input
      fetch_data();
    });
  }
}


function mrt_scroll(){

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


function scroll(){

  let pre_scrollPosition = window.scrollY;

  window.addEventListener("load", function () {
    window.scrollTo(0, 0);
  });

  window.addEventListener("scroll", function () {
    let windowHeight = window.innerHeight;
    let documentHeight = document.documentElement.scrollHeight;
    let scrollPosition = window.scrollY;
    console.log(isScrolling)

    if (!isScrolling&&scrollPosition + windowHeight >= documentHeight && scrollPosition - pre_scrollPosition>=0) {

      isScrolling = true  
      if(nextPage){
        if(input){
          api = "/api/attractions"+"?page="+nextPage+ "&"+"keyword="+input
        }else{
          api = "/api/attractions"+"?page="+nextPage+ "&"+"keyword="
        }
        clearTimeout(time)
        time = setTimeout(function(){fetch_data();},250)
        
      }
    }
     });

}

