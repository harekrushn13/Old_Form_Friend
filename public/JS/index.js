//create-form-btn
const createFormBtn = document.getElementById('create-form-btn');

createFormBtn.addEventListener('click', () => {
  if (getCookie("jwttoken") != ""){
    window.open('https://docs.google.com/forms/u/0/?tgif=d', '_blank');
  }
});

//add-form-btn
const addFormBtn = document.getElementById('add-form-btn');

addFormBtn.addEventListener('click', () => {
  if (getCookie("jwttoken") != ""){
    window.open('/addform', '_parent');
  }
});

//view-form-btn
const viewFormBtn = document.getElementById('view-form-btn');

viewFormBtn.addEventListener('click', () => {
  if (getCookie("jwttoken") != ""){
    window.open('/forms', '_parent');
  }
});

// popup js
const popupLink = document.querySelector('.popup-link');
const popupContainer = document.querySelector('.popup-container');
const closeBtn = document.querySelector('.btn-close');
const popupOverlay = document.querySelector('.popup-overlay');

popupLink.addEventListener('click', function () {
  if (getCookie("jwttoken") != "") {
    popupContainer.style.display = 'block';
    popupOverlay.style.display = 'block';
  }
});

closeBtn.addEventListener('click', function () {
  popupContainer.style.display = 'none';
  popupOverlay.style.display = 'none';
});

//login-check
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

