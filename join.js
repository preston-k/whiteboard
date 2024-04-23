const firebaseConfig = {
  apiKey: "AIzaSyD9buqpjrjMB9Lig_3x5FhrMHm14EYdYf0",
  authDomain: "whiteboard-cd113.firebaseapp.com",
  databaseURL: "https://whiteboard-cd113-default-rtdb.firebaseio.com",
  projectId: "whiteboard-cd113",
  storageBucket: "whiteboard-cd113.appspot.com",
  messagingSenderId: "506254176716",
  appId: "1:506254176716:web:c11eb4ad6863809da52d69"
}
firebase.initializeApp(firebaseConfig) 
let database = firebase.database() 

async function joinNow(event) {
  const urlParams = new URLSearchParams(location.search)
  let jc = urlParams.get('jc')
  let stat = urlParams.get('immediate')
  // let bid = urlParams.get('id')
  console.log(jc)
  if (jc == null) {
    alert('Sorry, we are unable to connect you to this board. Please enter the join code on the next page.') // URL Params not Complete
  } else {
    if (stat == 'true') {
      try {
        let snapshot = await firebase.database().ref('boards').child(jc).once('value')
        let bid = snapshot.val().id
        let userSnapshot = await database.ref(`boards/${jc}/users/users`).once('value')
        let data = userSnapshot.val()
        data += 1
        let userid = crypto.randomUUID()
        let name = prompt('What is your name?')
        await database.ref(`boards/${jc}/users/`).update({
          users: data
        })
        window.location.replace(`/board.html?id=${bid}&jc=${jc}&name=${name}&userid=${userid}`)
      } catch (error) {
        alert('This whiteboard was not found. Please check your joincode and try again. \n \nERR: Not Found: Firebase Join Code')
        // reload()
      }
    } else {
      alert('Sorry, we are unable to connect you to this board. Please enter the join code on the next page.') // Security feature not met
    }
    
  }
}

joinNow()