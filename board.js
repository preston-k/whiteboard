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
let dbRef = database.ref();

dbRef.on('value', function(snapshot) {
  const data = snapshot.val();
  console.log('Updated');

});