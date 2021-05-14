const map = [
  [0, 1, 2, 3, 2, 0, 0, 0, 0, 0, 2, 2, 2, 3, 0],
  [2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2],
  [3, 0, 0, 0, 2, 2, 3, 2, 2, 3, 2, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2],
  [0, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 0],
];

const actionTypes = {
  0: 'background',
  1: 'start',
  2: 'add',
  3: 'remove',
  4: 'chance',
  5: 'store',
};

class Tile {
  constructor(id, actionType) {
    (this.id = id), (this.actionType = actionType);
  }
  action(player) {
    if (this.actionType === 'add') {
      player.score += 5;
    } else {
      player.score -= 5;
    }
  }
}

function populateTileList(map) {
  const list = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const currentTileValue = map[i][j];

      const id = i * 15 + j;
      const actionType = actionTypes[currentTileValue];

      const tile = new Tile(id, actionType);

      list.push(tile);
    }
  }
  return list;
}

function populateDictionary(map, list) {
  const pathTiles = list.filter((tile) => tile.actionType !== 'background');

  const dictionary = {};
  let dictionaryIndex = 0;
  let i = 0;
  let j = 1;
  let lastMove = '';

  while (dictionaryIndex < pathTiles.length) {
    let mapIndex = i * 15 + j;

    dictionary[dictionaryIndex] = list[mapIndex];

    updateIndexes();
    dictionaryIndex++;
  }

  function updateIndexes() {
    const right = map[i][j + 1];
    const down = i < 6 ? map[i + 1][j] : 0;
    const up = i > 0 ? map[i - 1][j] : 0;
    const left = map[i][j - 1];

    if (j < 14 && right !== 0 && lastMove !== 'left') {
      lastMove = 'right';
      j += 1;
    } else if (i < 6 && down !== 0 && lastMove !== 'up') {
      i += 1;
      lastMove = 'down';
    } else if (i > 0 && up !== 0 && lastMove !== 'down') {
      i -= 1;
      lastMove = 'up';
    } else if (j > 0 && left !== 0 && lastMove !== 'right') {
      j -= 1;
      lastMove = 'left';
    }
    return;
  }

  return dictionary;
}

export const tileList = populateTileList(map);

export const pathDictionary = populateDictionary(map, tileList);
