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
const database = firebase.database();

// ------- test functions --------

// read from database once
// export function getReference() {
//   let db = database.ref();
//   const data = usersRef
//     .child('players')
//     .get()
//     .then((snapshot) => {
//       console.log(snapshot.val());
//     });

//   return data;
// }

// update database - not working perfectly

export const racingGamePlayers = database.ref('1/racingGame/players');

// set up listener for changes to 'users' scope of database
// users.on('value', (snapshot) => {
//   userData.push(snapshot.val());
//   //console.log(userData);
// });

//get tailored firebase ref
const getRef = (gameId, playerId ) => {
  if (playerId) {
    return `${gameId}/main/players/${playerId}`
  } else {
    return `${gameId}/main`
  }
};
//get players array in a game instance
export function getPlayersfromGame(gameId, cb) {
  const ref = getRef(gameId);
  let players = firebase.database().ref(ref + '/players');
  players.on("value", (snapshot) => {
    const data = snapshot.val();
    cb(data, 'playerList');
  });
}
//get turn in a game instance
export function getTurn(gameId, cb) {
  let turn = firebase.database().ref(`${gameId}/main/turn`);
  turn.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'turn');
  });
}
//get round in a game instance
export function getRound(gameId, cb) {
  let turn = firebase.database().ref(`${gameId}/main/round`);
  turn.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'round');
  });
}
//increment turn
export function updateTurn(gameId, restartTurns) {
  let turnUpdate = {};
  if (restartTurns === true) turnUpdate[`${gameId}/main/turn`] = 0;
  else {
    getTurn(gameId, (data) => {
    turnUpdate[`${gameId}/main/turn`] = data + 1;
  })
};
  return firebase.database().ref().update(turnUpdate);
}

//increment round
export function updateRound(gameId) {
  let roundUpdate = {};
  getRound(gameId, (data) => {
    roundUpdate[`${gameId}/main/round`] = data + 1;
  });
  return firebase.database().ref().update(roundUpdate);
}
//get user position
export function getPos(gameId, userId, cb) {
  let ref = getRef(gameId, userId)
  let pos = firebase.database().ref(ref + `/position`);
  pos.on("value", (snapshot) => {
    const data = snapshot.val();
    cb(data, 'pos');
  });
  return pos.off();
}
//increment position by newPos
export function updatePos(gameId, userId, newPos) {
  let updates = {};
  getPos(gameId, userId, function (data) {
    updates[`${gameId}/main/players/${userId}/position`] = data + newPos;
  });
  return firebase.database().ref().update(updates);
}
