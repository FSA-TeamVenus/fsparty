import firebase from 'firebase/app';
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseUrl: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

//  ----------------- Racing game functions ----------------

export const playersRef = (gameId) => {
  return database.ref(`${gameId}/racingGame/players`);
};
export const racingGamePlayers = database.ref('8/racingGame/players');

export const getRacingGamePlayers = (gameId, spawned, cb) => {
  const players = playersRef(gameId);
  players.on('value', (snapshot) => {
    const list = snapshot.val();
    if (!spawned) {
      cb(list);
      spawned = true;
    }
  });
};

export const updateRacingGamePlayers = (gameId, playerId, cb) => {
  const players = database.ref(`${gameId}/racingGame/players`);
  players.on('child_changed', (snapshot) => {
    const player = snapshot.val();
    if (player.playerId !== playerId) {
      cb(player);
    }
  });
};

export const finishRacingGame = (gameId) => {
  const game = database.ref(`${gameId}/racingGame`);
  game.update({ completed: true });
};

export const addPoints = (gameId, playerId, newPoints) => {
  const player = database.ref(`${gameId}/main/players/${playerId}`);
  player.once('value').then((snapshot) => {
    const score = snapshot.val().score;
    const newScore = score + newPoints;
    player.update({ score: newScore });
  });
};

// -------------- main game functions -----------------

//get tailored firebase ref
const getRef = (gameId, playerId) => {
  if (playerId) {
    return `${gameId}/main/players/${playerId}`;
  } else {
    return `${gameId}/main`;
  }
};
//get players array in a game instance
export function getPlayersfromGame(gameId, cb) {
  const ref = getRef(gameId);
  let players = firebase.database().ref(ref + '/players');
  players.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'playerList');
  });
  // return players.off
  return firebase.database().ref(ref).off;
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
export function updateTurn(gameId) {
  let turnUpdate = {};
  getTurn(gameId, (data) => {
    turnUpdate[`${gameId}/main/turn`] = data + 1;
  });
  return firebase.database().ref().update(turnUpdate);
}

//increment round and reset turn to 0
export function updateRound(gameId) {
  let updates = {};
  getRound(gameId, (data) => {
    updates[`${gameId}/main/round`] = data + 1;
  });
  getTurn(gameId, (data) => {
    updates[`${gameId}/main/turn`] = 0;
  });
  updates[`${gameId}/main/racingGame/players`] = {
    0: { x: 32 },
    1: { x: 32 },
    2: { x: 32 },
    3: { x: 32 },
  };
  return firebase.database().ref().update(updates);
}
//get user position
export function getPos(gameId, playerId, cb) {
  let ref = getRef(gameId, playerId);
  let pos = firebase.database().ref(ref + `/position`);
  pos.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'pos');
  });
  return pos.off();
}
//increment position by newPos
export function updatePos(gameId, playerId, diceRoll, cb) {
  const player = database.ref(`${gameId}/main/players/${playerId}`);
  player.once('value').then((snapshot) => {
    const position = snapshot.val().position;
    let newPosition = position + diceRoll;
    if (newPosition > 43) newPosition = newPosition - 44;
    player.update({ position: newPosition });
  });
  // let updates = {};
  // getPos(gameId, playerId, function (data) {
  //   console.log(data)
  //   updates[`${gameId}/main/players/${playerId}/position`] = data + diceRoll;
  //   return firebase.database().ref().update(updates);
  // });
}
//get shootingGame players
export function getShootingPlayers(gameId, cb) {
  let playerList = firebase.database().ref(`${gameId}/shootingGame/players`);
  playerList.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data);
  });
}
//get other reticle positions (for shooting game)
export function getOtherReticles(gameId, cb) {
  let playerList = firebase.database().ref(`${gameId}/shootingGame/players`);
  playerList.on('child_changed', (snapshot) => {
    const data = snapshot.val();
    cb(data);
  });
}
//update reticle position
export function updateReticlePos(gameId, playerId, data) {
  let updates = {};
  updates[`${gameId}/shootingGame/players/${playerId}`] = data;
  return firebase.database().ref().update(updates);
}

export function updateScore(gameId, playerId, newScore) {
  let updates = {};
  updates[`${gameId}/main/players/${playerId}/score`] = newScore;

  return firebase.database().ref().update(updates);
}

// ------ create new game -------

const gameObj = {
  main: {
    turn: -1,
    round: 1,
    players: {
      0: {
        playerId: 0,
      },
    },
  },
  racingGame: {
    completed: false,
    players: {
      0: {
        playerId: 0,
        x: 32,
      },
    },
  },
  platformGame: {
    players: {
      0: {
        playerId: 0,
      },
    },
  },
};

const racingGameInitY = {
  0: 400,
  1: 300,
  2: 200,
  3: 100,
};

export function createNewGame() {
  let updates = {};
  database
    .ref()
    .once('value')
    .then((snapshot) => {
      const games = snapshot.val();
      let gameId = findNextNumber(Object.keys(games));
      // let gameId = Object.keys(games).length + 1;
      updates[gameId] = gameObj;
      database.ref().update(updates);
      window.localStorage.setItem('gameId', gameId);
    });
}

export function getNewPlayerId(gameId) {
  let playersRef = database.ref(`${gameId}/main/players`);
  let updates = {};
  playersRef.once('value').then((snapshot) => {
    let players = snapshot.val();
    const newId = Object.keys(players).length;
    window.localStorage.setItem('idKey', newId);
    updates[`${gameId}/main/players/${newId}`] = { score: 0 };
    database.ref().update(updates);
  });
}

export function addPlayerToGame(gameId, playerId, playerData) {
  let mainGameRef = `${gameId}/main/players/${playerId}`;
  let racingGameRef = `${gameId}/racingGame/players/${playerId}`;
  let platformGameRef = `${gameId}/platformGame/players/${playerId}`;
  let updates = {};
  updates[mainGameRef] = {
    ...playerData,
    score: 0,
    position: 0,
  };
  updates[racingGameRef] = {
    playerId,
    color: playerData.color,
    name: playerData.name,
    x: 32,
    y: racingGameInitY[playerId],
  };
  updates[platformGameRef] = { playerId };
  database.ref().update(updates);
}

function findNextNumber(sequence) {
  const length = sequence.length;
  for (let i = 0; i < length; i++) {
    let x = i + 1;
    //console.log(`Key: ${Number(sequence[i])} x: ${x}`)
    if (Number(sequence[i]) !== x) {
      sequence.splice(i, 0, x); // insert x here
      sequence.length = length; // chop off the rest
      return x;
    }
  }
  // else
  return length + 1; //array length + 1 as next number
}
