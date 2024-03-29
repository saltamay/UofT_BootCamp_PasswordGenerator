/* Global Variables */
const newListArr = [];
// Default length for the password
const defaultLength = 12;
let capitalLetters = [];
let smallLetters = [];
const specialChars = [33, 35, 36, 37, 38, 42, 64, 94];
const numbers = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
let passwordArr = [...specialChars, ...numbers];
let isStarClicked = false;


/* Utility Functions */
// Load the password array with ASCII codes for A-Z and a-z
const loadLetters = () => {
  // load charecter codes for capital letters
  for (let i = 65; i <= 90; i++) {
    capitalLetters.push(i);
  }
  // load charecter codes for small letters
  for (let i = 97; i <= 122; i++) {
    smallLetters.push(i);
  }
  // Push the default codes to the password arr
  passwordArr = [...capitalLetters, ...smallLetters, ...passwordArr];
}

// Creates random character from an arr that holds ASCII codes 
const createRandChar = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return String.fromCharCode(arr[randIndex]);
}

// Generate password
const generatePass = (arr) => {
  // const passLength = document.getElementById('passLength').value;
  let password = "";
  for (let i = 0; i < defaultLength; i++) {
    const char = createRandChar(arr);
    password += char;
  }
  document.getElementById('modalPassword').value = password;
}

// Eye icon toggles the password making it visible/not visible 
const togglePassword = () => {

  const passInput = document.getElementById('modalPassword');
  
  if (passInput.type === 'password') {
    // Make the password visible
    passInput.type = 'text';

    const eyeIcon = document.querySelector('.fa-eye');
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');

  } else {
    // Hide the password
    passInput.type = 'password';

    const eyeIcon = document.querySelector('.fa-eye-slash');
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
  }
}

// Copy to clipboard
const copy = () => {
  /* Get the text field */
  const passCopy = document.getElementById("modalPassword");

  /* Select the text field */
  passCopy.select();
  passCopy.blur();
  passCopy.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");
  // Confirm that password copied
  alertCopy();
}

// Display a meesage to confirm password is copied to clipboard
const alertCopy = () => {

  const div = document.createElement('div');

  // List of bootstrap classes
  const cls = ["alert", "alert-dismissible", "fade", "show", "alert-copy"];

  div.classList.add(...cls);

  div.innerHTML = `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span id="alertClose" aria-hidden="true" class="text-white">&times;</span>
                  </button>
                  <span class="pr-5"><i class="fas fa-info-circle pr-2"></i>Password copied</span>`


  document.querySelector('#alert-container').appendChild(div);

  // Delete the alert after 3 seconds
  setTimeout(() => {
    div.remove();
  }, 3000);
}

// Save new password item to local storage
const addToLocalStorage = (password) => {

  let passArr = JSON.parse(localStorage.getItem('passwords'));

  if (passArr) {
    passArr.push(password);
  } else {
    passArr = [];
    passArr.push(password);
  }

  localStorage.setItem('passwords', JSON.stringify(passArr));
}

const savePassword = () => {

  const name = document.getElementById('passName').value;
  const userName = document.getElementById('userName').value;
  const url = document.getElementById('url').value;
  const password = document.getElementById('modalPassword').value;

  let starClicked = isStarClicked;

  if (document.querySelector('.star').classList.contains('favorite')) {
    starClicked = !isStarClicked;
  }

  console.log(starClicked);
  console.log(isStarClicked);

  const passLog = {
    name,
    userName,
    url,
    password,
    starClicked
  }

  console.log(passLog);

  addToLocalStorage(passLog);

  // Close the modal
  $('#exampleModal').modal('toggle');

  // Clear modal input fields
  document.getElementById('passName').value = "";
  document.getElementById('userName').value = "";
  document.getElementById('url').value = "";
  document.getElementById('modalPassword').value = "";
  document.querySelector('.star').classList.remove('favorite');


  displayPassList(passLog);
}

const toggleFavorite = (e) => {
  let name = e.target.parentNode.parentNode.parentNode.firstElementChild.innerHTML;
  console.log(name);
  e.target.classList.toggle('favorite');
  // Get the items on local storage to update favorite state
  const newStateArr = JSON.parse(localStorage.getItem('passwords'));
  console.log(newStateArr);
  // Set the state to opposite of itself
  for (let index = 0; index < newStateArr.length; index++) {
    if(newStateArr[index].name === name) {
      newStateArr[index].starClicked = !newStateArr[index].starClicked;
      break;
    }  
  }
  console.log(newStateArr);
  // Rewrite the local storage
  localStorage.setItem('passwords', JSON.stringify(newStateArr));
}

const createListItem = (password, list) => {
  
  const li = document.createElement('li');
  const spanStar = document.createElement('span');
  const spanTrash = document.createElement('span');
  const div = document.createElement('div');
  const iconContainer = document.createElement('div');

  if (password['starClicked']) {
    spanStar.innerHTML = `<i class="star favorite fas fa-star pt-3 pl-2"></i>`;
  } else {
    spanStar.innerHTML = `<i class="star fas fa-star pt-3 pl-2"></i>`;
  }

  spanTrash.innerHTML = `<i class="fas fa-trash-alt"></i>`;  

  iconContainer.appendChild(spanStar);
  iconContainer.appendChild(spanTrash);
  div.appendChild(iconContainer);

  
  li.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-star')) {
      toggleFavorite(e);
    }
  });

  li.classList.add('list-group-item', 'p-0', 'border-0');

  li.innerHTML = `<div class="card border-left-0 border-right-0 rounded-0 " style="width: 100%;">
                    <div class="card-body p-2 d-flex justify-content-between">
                      <a href="${password.url}" class="card-link">${password.name}</a>
                      <p class="card-text">${password.userName}</p>
                      ${div.innerHTML}
                    </div>
                  </div>`;

  document.querySelector(list).appendChild(li);
}

// const displayNewList = (password) => {

//   if (newListArr.length !== 0) {
//     while (document.querySelector('.new.password-list').hasChildNodes()) {
//       document.querySelector('.new.password-list').firstChild.remove();
//     }
//   }
  
//   newListArr.push(password);

//   const sortedArr = sortByName(newListArr);

//   sortedArr.forEach(password => {
//     createListItem(password, '.new.password-list')
//   });
//   document.querySelector('.new-list').style.display = 'block';
// }

const displayPassList = () => {

  let passArr = JSON.parse(localStorage.getItem('passwords'));

  if (passArr === null) {
    
    const div = document.createElement('div');
    div.innerHTML = '<h5 class="empty-list text-center mt-3">Your vault is empty</h5>'
    document.querySelector('.vault-section').appendChild(div);

  } else {
    const emptyMessage = document.querySelector('.empty-list');
    
    if (emptyMessage) {
      emptyMessage.remove();
    }

    while (document.querySelector('.existing.password-list').hasChildNodes()) {
      document.querySelector('.existing.password-list').firstChild.remove();
    }
    // Sort passwords by passwords name
    passArr = sortByName(passArr);
    console.log(passArr);
    // Loop through the passwords array and display them as list items
    passArr.forEach(element => {
      createListItem(element, '.existing.password-list');
    });
  }
}

// Sort an array of objects by name property
const sortByName = (arr) => {
  arr.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB)
      return -1
    if (nameA > nameB)
      return 1
    return 0
  });

  return arr;
}


// Add event listener to the password generate button
document.getElementById('createPass').addEventListener('click', () => { generatePass(passwordArr) });
document.getElementById('togglePassword').addEventListener('click', togglePassword);
document.getElementById('copyPassword').addEventListener('click', copy);
document.getElementById('save').addEventListener('click', savePassword);
// document.querySelector('.star').addEventListener('click', function(e){toggleFavorite(e)});


displayPassList();
loadLetters();
