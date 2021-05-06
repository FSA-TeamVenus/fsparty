import firebase from 'firebase/app';
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDYsGreUx-uAHV5sDv6YhiuSEd3k95WkDE',
  authDomain: 'fsparty-d0c16.firebaseapp.com',
  databaseUrl: 'https://fsparty-d0c16-default-rtdb.firebaseio.com/',
  projectId: 'fsparty-d0c16',
  storageBucket: 'fsparty-d0c16.appspot.com',
  messagingSenderId: '746505029214',
  appId: '1:746505029214:web:d7758bf54cf255865596cf',
  measurementId: 'G-JEVNY56SEG',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const database = firebase.database();

// ------- test functions --------

// read from database once
function getReference() {
  let database = firebase.database();
  let usersRef = database.ref();
  const data = usersRef
    .child('users')
    .get()
    .then((snapshot) => {
      console.log(snapshot.val());
    });

  return data;
}

// update database - not working perfectly

function setData(name) {
  database.ref('users').update({
    name,
  });
}

setData('david');
setData('reid');

const userData = [];
let users = firebase.database().ref('users');

// set up listener for changes to 'users' scope of database
users.on('value', (snapshot) => {
  userData.push(snapshot.val());
  console.log(userData);
});
