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
    let boardid;
    await firebase.database().ref('boards').child(codeInput).once('value').then(function(snapshot) {
      boardid = snapshot.val().id;
    })
    let name = prompt('What is your name?')
    // let ucount = await firebase.database().ref('boards/' + codeinput + '/users/users').once('value').then(snapshot => {
    //   let value = snapshot.val()
    //   console.log(value)
    //   return value
    // });
    // console.log(ucount)
    window.location.replace('/board.html?id='+boardid+'&jc='+codeInput + '&name='+name+'&userid='+userid)
  } catch (error) {
    alert('This whiteboard was not found. Please check your joincode and try again. \n \nERR: nf-fb-jc')
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
function createNew() {
  console.log('CreateNew')
}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#create').addEventListener('click', createBoard);
  document.querySelector('#joinbut').addEventListener('click', joinBoard);
  document.querySelector('#createNew').addEventListener('click', createNew);
});

