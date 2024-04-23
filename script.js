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
    alert('This whiteboard was not found. Please check your joincode and try again. \n \nERR: Not Found: Firebase Join Code')
    reload()
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