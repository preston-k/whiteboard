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

const urlParams = new URLSearchParams(window.location.search)
let board = urlParams.get('id')
let joincode = urlParams.get('jc')
let username = urlParams.get('name')
let uid = urlParams.get('userid')
if (username != null || username != '') {
  console.log(username)
  let userid = urlParams.get('userid')
  console.log(userid)
  
  if (true) {
    console.log('Not')
  } else { // Implies that a user is not in the system yet
    firebase.database().ref('boards/'+joincode+'/users').once('value', snapshot => {
      const usersData = snapshot.val();
      console.log(usersData);
    });
    await database.ref('boards/' + joincode + '/users/').update({
      users: ''
    });
  }
}
let dbRef = database.ref()

dbRef.on('value', function(snapshot) {
  const data = snapshot.val();
  console.log('Updated');
  // Run code whenever the database is updated: 
  // TO DO:   1. Check under the board id/join code node, 2. look under data/, 3. count how many different nodes are under there, 4. add each node onto the screen.
  let dataRef = database.ref('boards/'+joincode+'/data')
  let count = 0
  dataRef.once('value', function(snapshot) {
    let boardData = ''
    let dataCollection = []
    snapshot.forEach(function(childSnapshot) {
      let id = childSnapshot.child('id').val()
      console.log(id)
      let username = childSnapshot.child('username').val()
      console.log(username)
      let submitted = childSnapshot.child('submitted').val()
      console.log(submitted)
      // dataCollection.push({ id, username, submitted })
      let board = document.querySelector('#boarddata')
      boardData+= '<div id='+id+' class=lineItem><p class=un>'+username+'<p class=data>'+submitted+'</p></div>'
      board.innerHTML = boardData
    });
  });
  
  for (i in count) {
    console.log(i)
  }
})

function createNew() {
  document.getElementById('newSubForm').style.display = 'block'

}

document.querySelector('#createNew').addEventListener('click', createNew)
document.querySelector('#close').addEventListener('click', () => {
  document.getElementById('newSubForm').style.display = 'none'
})

async function submitSubmission() {
  if (document.querySelector('#submission').value == '') {
    alert("You can't submit a blank submission!")
  } else {
    let submissionId = self.crypto.randomUUID()
    console.log('sid='+submissionId)
    let submitter = username
    console.log('submitter='+submitter)
    let ts = new Date().toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    console.log('ts='+ts)
    let submission = document.querySelector('#submission').value
    console.log(submission)
    try {
      await database.ref('boards/' + jc + '/data/'+submissionId).update({ 
        submitted: submission,
        ts: ts,
        username: submitter,
        id: submissionId,
        userid: uid,
      }) 
      document.getElementById('newSubForm').style.display = 'none'
    } catch (error) {
      alert('Sorry, and error was detected. Your submission was not posted. Please resubmit your submission!')
    }
  }
}

document.querySelector('#submit').addEventListener('click', submitSubmission)