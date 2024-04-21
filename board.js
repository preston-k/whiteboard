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
const blocklist = ['fuck', 'shit', 'ass', 'nigger', 'bitch', 'bastard', 'slut', 'dick', 'cunt', 'pussy', 'whore', 'fag', 'damn', 'douche', 'twat', 'cock', 'bollocks', 'arsehole', 'asshole', 'bugger', 'wanker', 'prick', 'tits', 'cum', 'boob', 'clit', 'fanny', 'piss', 'dildo', 'dyke', 'slag', 'motherfucker', 'goddamn', 'bint', 'bellend', 'muff', 'paki', 'chink', 'coon', 'kike', 'spic', 'faggot', 'poof', 'nonce', 'tranny', 'gringo', 'jizz', 'minge', 'nazi', 'bollock', 'bollox', 'shite', 'retard', 'cumshot', 'gook', 'beaner', 'skeet', 'tit', 'knob', 'felch', 'kunt', 'pecker', 'gooch', 'punani', 'taint', 'wang', 'wank', 'poon', 'schlong', 'fuckwit', 'poontang', 'gash', 'snatch', 'fuckboy', 'cumdump', 'shithead', 'fuckface', 'skank', 'hoe', 'bimbo', 'sod', 'coochie', 'thot', 'douchebag', 'arse'] // ChatGPT generated word list to block if these words get added to the submissions.

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
    console.log('User in System')
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
  console.log('DB Updated');

  database.ref(`boards/${joincode}/users/users`).once('value', snapshot => {
    const data = snapshot.val()
    console.log(data)
    usercount.innerHTML = 'Users: '+ data
  });
  // Run code whenever the database is updated: 
  // TO DO:   1. Check under the board id/join code node, 2. look under data/, 3. count how many different nodes are under there, 4. add each node onto the screen.
  // let user = database.ref('boards/'+joincode+'/users')
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
      boardData+= '<div id='+id+' class=lineItem><p class=un>Submitted By: '+username+'<p class=data>'+submitted+'</p></div>'
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
    if (document.querySelector('#submission').value.includes("<") || document.querySelector('#submission').value.includes(">")) {
      alert('Sorry, your submission CANNOT contain the characters "<" or ">". Please edit your submission and try again.')
    } else {
      if (blocklist.some(word => document.querySelector('#submission').value.toLowerCase().includes(word))) {
        alert('Sorry, your submission contains a blocked word. Please edit your submission and try again.')
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
          document.querySelector('#submission').value = ''
          document.getElementById('newSubForm').style.display = 'none'
          
        } catch (error) {
          alert('Sorry, and error was detected. Your submission was not posted. Please resubmit your submission!')
        }
      }
    }
  }
}
async function deleteSubmission(subId) {
  console.log('Delete')
  console.log(subId)
  firebase.database().ref(`boards/${joincode}/data/${subId}`).remove()
  document.querySelector('#boarddata').style.display = 'block'
  document.querySelector('#viewsubs').style.display = 'none'
}
async function editSubmission(subId) {
  console.log('Edit');
  console.log(subId);
  document.querySelector('#editing-' + subId).style.display = 'block';
  document.querySelector('#view-' + subId).style.display = 'none';
  document.querySelector('#save-' + subId).style.display = 'inline';
  console.log(jc)
  database.ref(`boards/${joincode}/data/${subId}/submitted`).once('value', snapshot => {
    const data = snapshot.val()
    document.querySelector('#textarea-' + subId).value = data
    console.log(data)
  });
}
async function saveEdit(subId) {
  console.log('Save Edits')
  console.log(subId)
  let editing = document.querySelector('#textarea-'+subId).value
  console.log(editing)
  try {
    await database.ref('boards/' + joincode + '/data/'+subId).update({ 
      submitted: editing
    })
    document.querySelector('#text-'+subId).style.display = 'inline' 
    setTimeout(() => {
      document.querySelector('#text-'+subId).style.display = 'none' 
    }, 3000);
  } catch (error) {
    alert('Sorry, and error was detected. Your submission was not updated. Please try again!')
  }
  
}

async function edit() {
  console.log('Edit')
  document.querySelector('#boarddata').style.display = 'none'
  document.querySelector('#viewsubs').style.display = 'block'
  let subcount = 0
  let subs = ''
  let subid = ''
  try {
    const dataSnapshot = await database.ref('boards/'+joincode+'/data').once('value')
    const data = dataSnapshot.val()
    if (data) {
      Object.values(data).forEach(dataNode => {
        if (dataNode.userid === uid) {
          subcount += 1
          console.log(dataNode.submitted)
          subid = dataNode.id
          subs += '<div class=subviews><div class="editing" id="editing-'+subid+'"><textarea id="textarea-'+subid+'" class=editBox></textarea></div><div class="subViewer"><p id="view-'+subid+'">' + dataNode.submitted + '</p></div><button id="edit-' + subid + '" class=editbut>Edit</button><button id="delete-' + subid + '" class=deletebut>Delete</button><button id="save-'+subid+'" class=savebut>Save</button><p class=savedtext id="text-'+subid+'">Sucessfully Saved!</p></div>'
        }
      })
      
      document.querySelector('#subcount').innerHTML = 'You have ' + subcount + ' submissions.'
      document.querySelector('#submissionview').innerHTML = subs
      document.querySelectorAll('.deletebut').forEach(button => {
        button.addEventListener('click', function() {
          let subId = this.id.slice(7, 100)
          deleteSubmission(subId)
        })
      })
      document.querySelectorAll('.editbut').forEach(button => {
        button.addEventListener('click', function() {
          let subId = this.id.slice(5, 100)
          editSubmission(subId)
        })
      })
      document.querySelectorAll('.savebut').forEach(button => {
        button.addEventListener('click', function() {
          let subId = this.id.slice(5, 100)
          saveEdit(subId)
        })
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}


async function close() {
  document.querySelector('#boarddata').style.display = 'block'
  document.querySelector('#viewsubs').style.display = 'none'
}
document.querySelector('#submit').addEventListener('click', submitSubmission)
document.querySelector('#edit').addEventListener('click', edit)

document.querySelector('#closeEdit').addEventListener('click', close)

function editSub(submissionId) {
  console.log(submissionId)
}

document.querySelector('#leave').addEventListener('click', () => {
  console.log('leave?')
  if (confirm('Are you sure you would like to leave this board? You CANNOT rejoin as the same user.\n\nTo proceed, click "OK". To cancel, click "Cancel"')) {
    database.ref(`boards/${joincode}/users/users`).once('value', snapshot => {
      let data = snapshot.val()
      data -= 1
      console.log(data)
      database.ref('boards/' + joincode + '/users/').update({ 
        users: data
      }) 
    });
    window.location.replace('/')
  }
})