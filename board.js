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
/** @type {typeof import("./static.json")} */
const data = await fetch("/static.json").then((x) => x.json())
let version = data.version
console.log('Version: '+version)
const urlParams = new URLSearchParams(window.location.search)
let board = urlParams.get('id')
let joincode = urlParams.get('jc')
let username = urlParams.get('name')
let uid = urlParams.get('userid')

if (board == null || joincode == null) {
  document.querySelector('body').style.display = 'none'
  alert("Sorry, you have joined a board that doesn't exist! Please enter a join code on the next page.")
  window.location.replace('/')
}
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
    usercount.innerHTML = 'Participants: '+ data
    document.querySelector('#devstats-participants').innerHTML = '<span class=\'boldp\'>pcount:</span> ' + data
  })
  // Run code whenever the database is updated: 
  // TO DO:   1. Check under the board id/join code node, 2. look under data/, 3. count how many different nodes are under there, 4. add each node onto the screen.
  // let user = database.ref('boards/'+joincode+'/users')
  let dataRef = database.ref('boards/'+joincode+'/data')
  let count = 0
  dataRef.once('value', function update(snapshot) {
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
      boardData+= '<div id='+id+' class=lineItem><p class=un>Submitted By: '+username+'<p class=data>'+submitted+'</p><p class=globalDelete id="globalDelete-'+id+'">Delete</p></div>'
      board.innerHTML = boardData
      if (uid == null || uid == '') {
        document.querySelectorAll('.globalDelete').forEach(element => {
          element.style.display = 'block'
        });
      }
      document.querySelectorAll('.lineItem').forEach(element => {
        element.addEventListener('click', function() {
          let subId = this.id
          console.log(subId)
          
          let submissionPath = 'boards/'+joincode + '/data/' + subId + '/submitted'
          database.ref(submissionPath).once('value', (snapshot) => {
            let submission = snapshot.val()
            console.log(submission)
            if (submission != null) {
              document.querySelector('#enlargedtext').innerHTML = submission
              document.querySelector('#desktoptool').style.display = 'none'
              document.querySelector('#boarddata').style.display = 'none' 
              document.querySelector('#qrcode').style.display = 'none' 
              document.querySelector('#joincode').style.display = 'none'
              document.querySelector('#usercount').style.display = 'none' 
              document.querySelector('#enlarged').style.display = 'flex'
            }
          })
        })
      })
      document.querySelectorAll('.globalDelete').forEach(button => {
        button.addEventListener('click', function() {
          let subId = this.id
          subId = subId.slice(13, 100)
          console.log(subId)
          firebase.database().ref(`boards/${joincode}/data/${subId}`).remove()
          update()
          updateBoardData()
        })
      })
    })
  })
  for (i in count) {
    console.log(i)
  }
})

function createNew() {
  document.getElementById('newSubForm').style.display = 'block'
}

function closeenlarged() {
  document.querySelector('#desktoptool').style.display = 'block'
  document.querySelector('#boarddata').style.display = 'block' 
  document.querySelector('#qrcode').style.display = 'none'  
  document.querySelector('#enlarged').style.display = 'none'
  if (username == null) {
    if (uid == null) {
      document.querySelector('#joincode').style.display = 'inline'
      document.querySelector('#usercount').style.display = 'inline'
    }
  }
}
document.querySelector('#createNew').addEventListener('click', createNew)
document.querySelector('#close').addEventListener('click', () => {
  document.getElementById('newSubForm').style.display = 'none'
})
const blocklist = []// Put words in that list to block them.

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
    alert('Sorry, an error was detected. Your submission was not updated. Please try again!')
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
      if (subcount == '1') {
        document.querySelector('#subcount').innerHTML = 'You have ' + subcount + ' submission.'
      } else {
        document.querySelector('#subcount').innerHTML = 'You have ' + subcount + ' submissions.'
      }
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
    if (uid == null || username == null) {
      window.location.replace('/')
    } else {
      role = 'participant'
      database.ref(`boards/${joincode}/users/users`).once('value', snapshot => {
        let data = snapshot.val()
        data -= 1
        console.log(data)
        database.ref('boards/' + joincode + '/users/').update({ 
          users: data
        }) 
      })
      window.location.replace('/')
    }
  }
})
let role = ''
let clickCount = 0
console.log(uid)
console.log(username)
async function changerole() {
  if (uid == null || username == null) {
    role = 'host'
  } else {
    role = 'participant'
  }
  console.log('cRole='+role)
  clickCount += 1
  console.log(clickCount)
  setTimeout(() => {
    clickCount = 0
    console.log('Role Switch Timed Out. clickCount='+clickCount)
  }, 3000);
  if (clickCount >= 5) {
    console.log('Switch role')
    clickCount = 0
    if (role == 'participant') {
      let userSnapshot = await database.ref(`boards/${joincode}/users/users`).once('value')
      let data = userSnapshot.val()
      data -= 1
      await database.ref(`boards/${joincode}/users/`).update({
        users: data
      })
      window.location.replace('/board.html?id='+board+'&jc='+joincode)
    }  else if (role == 'host') {
      console.log('Host')
      let userSnapshot = await database.ref(`boards/${joincode}/users/users`).once('value')
      let data = userSnapshot.val()
      let userName = prompt('What is your name?')
      data += 1
      await database.ref(`boards/${joincode}/users/`).update({
        users: data
      })
      let uid = self.crypto.randomUUID()
      window.location.replace('/board.html?id='+board+'&jc='+joincode+'&name='+userName+'&userid='+uid)
    }
  } 
}

document.querySelector('#changerole').addEventListener('click', changerole)

let qrdata = 'https://whiteboard.prestonkwei.com/join?immediate=true&referrer=qr&jc=' + encodeURIComponent(urlParams.get('jc'))
let imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qrdata)}`

document.getElementById('boardlink').innerHTML = 'https://whiteboard.prestonkwei.com/join?immediate=true&referrer=qr&jc='+urlParams.get('jc')
document.getElementById('qrimg').src = imageUrl

function hideQr() {
  document.querySelector('#desktoptool').style.display = 'block'
  document.querySelector('#boarddata').style.display = 'block'
  document.querySelector('#qrcode').style.display = 'none'
}
function showQr() {
  document.querySelector('#desktoptool').style.display = 'none'
  document.querySelector('#boarddata').style.display = 'none' 
  document.querySelector('#qrcode').style.display = 'block' 
}

document.querySelector('#showQr').addEventListener('click', showQr)
document.querySelector('#closeQr').addEventListener('click', hideQr)

document.querySelector('#closelarge').addEventListener('click', closeenlarged)

let statsopen = false
document.querySelector('#devinfo').addEventListener('click', () => {
  console.log('Devinfo')
  if (statsopen == true) {
    document.querySelector('#hiddendev').style.display = 'none'
    statsopen = false
  } else if (statsopen == false) {
    document.querySelector('#hiddendev').style.display = 'block'
    statsopen = true
  }
  
})
document.querySelector('#devstats-version').innerHTML = '<span class=\'boldp\'>Version:</span> ' + version 
document.querySelector('#devstats-uid').innerHTML = '<span class=\'boldp\'>uid:</span> ' + uid
document.querySelector('#devstats-bid').innerHTML = '<span class=\'boldp\'>bid:</span> ' + board
document.querySelector('#devstats-jc').innerHTML = '<span class=\'boldp\'>joincode:</span> ' + joincode

document.querySelector('#devstats-un').innerHTML = '<span class=\'boldp\'>un:</span> ' + username
document.querySelector('#devstats-overallstatus').innerHTML = 'ALL SYSTEMS OK!'

document.querySelector('#saveboard').addEventListener('click', () => {
  console.log('Save Board')
  console.log(board +':'+joincode)
  let count = parseInt(localStorage.getItem('savedboards-count'))+1
  
  let sbLocal = JSON.parse(localStorage.getItem('savedboards'))

  let pushtolocal = { ...sbLocal }
  pushtolocal = {
    ...pushtolocal,
    [joincode]: board 
  }
  
  localStorage.setItem('savedboards', JSON.stringify(pushtolocal))
  alert('Board sucessfully saved! We have saved your board, and you can view it on the homepage!')
})

