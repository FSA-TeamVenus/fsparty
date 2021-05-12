const layout = [
  [1, 2, 2, 3, 2, 2, 2, 2, 2, 3, 2, 2, 2, 3, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3],
];

const actionTypes = {
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

function populateDictionary(list) {
  const dictionary = {};
  const pathTiles = list.filter((tile) => tile.actionType !== 'background');
  const top = pathTiles.filter((tile) => tile.id < 15);
  const bottom = pathTiles
    .filter((tile) => tile.id > 89)
    .sort((a, b) => b.id - a.id);
  const leftSide = [];
  const rightSide = [];
  for (let i = 15; i < 25; i++) {
    let currentTile = pathTiles[i];
    if (!(currentTile.id % 15)) {
      leftSide.unshift(currentTile);
    } else if (!((currentTile.id + 1) % 15)) {
      rightSide.push(currentTile);
    }
  }
  const fullPath = top.concat(rightSide).concat(bottom).concat(leftSide);

  for (let i = 0; i < fullPath.length; i++) {
    dictionary[i] = fullPath[i];
  }

  return dictionary;
}

export const tileList = populateTileList(layout);

export const tileDictionary = populateDictionary(tileList);
