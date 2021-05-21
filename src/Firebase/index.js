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

export const playersRef = (gameId, game) => {
  return database.ref(`${gameId}/${game}/players`);
};

export const getRacingGamePlayers = (gameId, spawned, cb) => {
  const players = playersRef(gameId, 'racingGame');
  players.once('value').then((snapshot) => {
    const list = snapshot.val();
    if (!spawned) {
      cb(list);
      spawned = true;
    }
  });
};

export const updateRacingGamePlayers = (gameId, playerId, cb) => {
  const players = playersRef(gameId, 'racingGame');
  players.on('child_changed', (snapshot) => {
    const player = snapshot.val();
    if (player.playerId !== playerId) {
      cb(player);
    }
  });
  return () => players.off();
};

export const addPoints = (gameId, playerId, newPoints) => {
  const player = database.ref(`${gameId}/main/players/${playerId}`);
  player.once('value').then((snapshot) => {
    const score = snapshot.val().score;
    const newScore = score + newPoints;
    player.update({ score: newScore });
  });
};

export const serverCoins = database.ref('1/platformGame/coins');

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
  const players = database.ref(ref + '/players');
  players.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'playerList');
  });
  return () => players.off();
}
//get turn in a game instance
export function getTurn(gameId, cb) {
  const turn = database.ref(`${gameId}/main/turn`);
  turn.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'turn');
  });
  return () => turn.off();
}
//get round in a game instance
export function getRound(gameId, cb) {
  const round = database.ref(`${gameId}/main/round`);
  round.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'round');
  });
  return () => round.off();
}

//get user position
export function getPos(gameId, playerId, cb) {
  const pos = database.ref(`${gameId}/main/players/${playerId}/position`);
  pos.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'pos');
  });
  return () => pos.off();
}

//increment turn
export function updateTurn(gameId) {
  const turnUpdate = {};
  getTurn(gameId, (data) => {
    turnUpdate[`${gameId}/main/turn`] = data + 1;
  });
  return database.ref().update(turnUpdate);
}

//increment round and reset turn to 0
export function updateRound(gameId) {
  const updates = {};
  getRound(gameId, (data) => {
    updates[`${gameId}/main/round`] = data + 1;
  });
  getTurn(gameId, (data) => {
    updates[`${gameId}/main/turn`] = 0;
  });

  return database.ref().update(updates);
}

//increment position by newPos
export function updatePos(gameId, playerId, diceRoll) {
  const player = database.ref(`${gameId}/main/players/${playerId}`);
  player.once('value').then((snapshot) => {
    const position = snapshot.val().position;
    const newPosition = position + diceRoll;
    if (newPosition > 43) newPosition = newPosition - 44;
    player.update({ position: newPosition });
  });
}

export function removeFromDatabase(gameId) {
  const gameRef = database.ref(`${gameId}`);
  gameRef.remove();
}

// -------- shooting game -------

//get shootingGame players
export function getShootingPlayers(gameId, cb) {
  let playerList = firebase.database().ref(`${gameId}/shootingGame/players`);
  playerList.once('value', (snapshot) => {
    const data = snapshot.val();
    cb(data);
  });
}
//get other reticle positions (for shooting game)
export function getOtherReticles(gameId, cb) {
  const playerList = database.ref(`${gameId}/shootingGame/players`);
  playerList.on('child_changed', (snapshot) => {
    const data = snapshot.val();
    cb(data);
  });
}
//update reticle position
export function updateReticlePos(gameId, playerId, data) {
  const updates = {};
  updates[`${gameId}/shootingGame/players/${playerId}`] = data;
  return database.ref().update(updates);
}
//update targets/targetIdx/hit to true
export function updateTarget(gameId, targetIdx, hit) {
  let updates = {};
  if (hit) updates[`${gameId}/shootingGame/targets/${targetIdx}/hit`] = true;
  else updates[`${gameId}/shootingGame/targets/${targetIdx}/hit`] = false;
  return firebase.database().ref().update(updates);
}
//update shooting game score
export function updateShootingScore(gameId, playerId, score) {
  console.log(score)
  let updates = {};
  updates[`${gameId}/shootingGame/players/${playerId}/score`] = score + 1;
  return firebase.database().ref().update(updates);
}
//establish target listener
export function getTargets(gameId, cb) {
  const targets = database.ref(`${gameId}/shootingGame/targets`);
  targets.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data);
  });
}

export function updateScore(gameId, playerId, newScore) {
  const updates = {};
  updates[`${gameId}/main/players/${playerId}/score`] = newScore;

  return database.ref().update(updates);
}

// ---------- update mini-game -------

export function updateMiniGame(gameId, game, instructions) {
  const updates = {};
  updates[`${gameId}/main/minigame`] = game;
  updates[`${gameId}/main/gameInstructions`] = instructions;
  return database.ref().update(updates);
}

export function getMiniGameData(gameId, cb) {
  const gameRef = database.ref(`${gameId}/main`);
  gameRef.once('value').then((snapshot) => {
    const scene = snapshot.val().minigame;
    const instructions = snapshot.val().gameInstructions;
    cb(scene, instructions);
  });
}

// ------ create new game -------

const gameObj = {
  main: {
    turn: -1,
    round: 1,
    players: {
      0: {
        playerId: 0,
        name: 'player joining...',
      },
    },
  },
  racingGame: {
    players: {
      0: {
        playerId: 0,
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
  shootingGame: {
    players: {
      0: {
        playerId: 0,
      },
    },
    targets: {
      0: {
        hit: false,
        x: 400,
      },
      1: {
        hit: false,
        x: 400,
      },
      2: {
        hit: false,
        x: 400,
      },
      3: {
        hit: false,
        x: 400,
      },
    }
  }
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
    updates[`${gameId}/main/players/${newId}`] = {
      name: 'player joining...',
      playerId: newId,
      score: 0,
    };
    database.ref().update(updates);
  });
}

export function addPlayerToGame(gameId, playerId, playerData) {
  let mainGameRef = `${gameId}/main/players/${playerId}`;
  let racingGameRef = `${gameId}/racingGame/players/${playerId}`;
  let platformGameRef = `${gameId}/platformGame/players/${playerId}`;
  let shootingGameRef = `${gameId}/shootingGame/players/${playerId}`;
  let updates = {};
  updates[mainGameRef] = {
    ...playerData,
    playerId,
    score: 0,
    position: 1,
  };
  updates[racingGameRef] = {
    playerId,
    color: playerData.color,
    name: playerData.name,
  };
  updates[platformGameRef] = { playerId, name: playerData.name };
  updates[shootingGameRef] = {
    playerId,
    name: playerData.name,
    color: playerData.color,
  };
  database.ref().update(updates);
}

function findNextNumber(sequence) {
  const length = sequence.length;
  for (let i = 0; i < length; i++) {
    let x = i + 1;
    if (Number(sequence[i]) !== x) {
      sequence.splice(i, 0, x); // insert x here
      sequence.length = length; // chop off the rest
      return x;
    }
  }
  // else
  return length + 1; //array length + 1 as next number
}
