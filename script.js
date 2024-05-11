const firebaseConfig = {
  apiKey: "AIzaSyD9buqpjrjMB9Lig_3x5FhrMHm14EYdYf0",
  authDomain: "whiteboard-cd113.firebaseapp.com",
  databaseURL: "https://whiteboard-cd113-default-rtdb.firebaseio.com",
  projectId: "whiteboard-cd113",
  storageBucket: "whiteboard-cd113.appspot.com",
  messagingSenderId: "506254176716",
  appId: "1:506254176716:web:c11eb4ad6863809da52d69"
};

firebase.initializeApp(firebaseConfig) 
let database = firebase.database() 
function joincode() {
  let digits = [];
  while (digits.length < 6) {
    let randomDigit = Math.floor(Math.random() * 10);
    if (!digits.includes(randomDigit)) {
      digits.push(randomDigit);
    }
  }
  return parseInt(digits.join(''));
}

let code = joincode();
let userid = self.crypto.randomUUID()
async function joinBoard(event) {
  try {
    event.preventDefault()
    let codeInput = document.getElementById('jc').value
    console.log(codeInput)

    let snapshot = await firebase.database().ref('boards').child(codeInput).once('value')
    let boardid = snapshot.val().id

    let userSnapshot = await database.ref(`boards/${codeInput}/users/users`).once('value')
    let data = userSnapshot.val()
    data += 1
    let name = prompt('What is your name?')
    await database.ref(`boards/${codeInput}/users/`).update({
      users: data
    })
    window.location.replace(`/board.html?id=${boardid}&jc=${codeInput}&name=${name}&userid=${userid}`)
  } catch (error) {
    alert('This whiteboard was not found. Please check your joincode and try again. \n \nERR: Not Found--Firebase Join Code')
    // reload()
  }
}


// // // // // // // // // // // // // // // // // // // // 
async function createBoard(event) {
  event.preventDefault();
  let bId = self.crypto.randomUUID();
  console.log(bId);
  let code = joincode();
  console.log(code);
  await database.ref('boards/' + code).update({
    id: bId
  });
  await database.ref('boards/' + code + '/users/').update({
    users: 0
  });
  window.location.replace('board.html?id='+bId+'&jc='+code)
}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#create').addEventListener('click', createBoard);
  document.querySelector('#joinbut').addEventListener('click', joinBoard);
  // document.querySelector('#createNew').addEventListener('click', createNew);
});

/** @type {typeof import("./static.json")} */
const data = await fetch("/static.json").then((x) => x.json())
let version = data.version
console.log('Version: '+version)
document.querySelector('#question-icon').addEventListener('click', () => {
  alert('This feature is currently in BETA. Board saving allows you to save a board to your device, so you can access it later. As it is in beta, please do NOT rely on this feature to be working, but please help us test out this new feature!')
})
document.querySelector('#word-container').addEventListener('click', () => {
  console.log('About')
  window.location = '/about.html'
})
let words = ' boards'
if (Object.keys(JSON.parse(localStorage.getItem('savedboards'))).length == 1) {
  console.log('1')
  words = ' board'
}

document.querySelector('#underline-number').innerHTML = Object.keys(JSON.parse(localStorage.getItem('savedboards'))).length + words
console.log(JSON.parse(localStorage.getItem('savedboards')))
console.log(Object.keys(JSON.parse(localStorage.getItem('savedboards'))).length)
let savedboards = Object.keys(JSON.parse(localStorage.getItem('savedboards')))
let count = Object.keys(JSON.parse(localStorage.getItem('savedboards'))).length

let localBoards = JSON.parse(localStorage.getItem('savedboards'))
let addToPush = ''
console.log(localBoards)
for (let key in localBoards) {
  console.log(key + ':' + localBoards[key])
  addToPush+=`<a class='a-no-underline' href='/board.html?id=${localBoards[key]}&jc=${key}'><div class='savedboard-preview'><p class='saved-code'>${key}</p><img src='https://cdn.prestonkwei.com/trashcan-icon.png' id='trash-${key}'class='trash'></div></a>`
  
}

document.querySelector('#savedpreviews').innerHTML = addToPush


document.querySelectorAll('.trash').forEach(item => {
  item.addEventListener('click', function(event) {
    event.preventDefault()
    if (confirm('You are about to delete this board from your device storage. Are you sure you would like to proceed?')) {
      console.log('Proceed')
      console.log(event.target.id)
      delete localBoards[event.target.id.slice(6)]
      localStorage.setItem('savedboards', JSON.stringify(localBoards))
      location.replace('/')
    } else {
      console.log('Cancelled')
    }
  })
})
