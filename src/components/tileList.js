import Phaser from 'phaser';

const tileCount = 105;
const tileArray = [];
const pathTiles = {};
const goodTiles = {};
const badTiles = {};
const neutralTiles = {};

//populate pathTiles
for (let i = 0; i < tileCount; i++) {
  let index = i + 1;
  if (index >= 2 && index <= 14) {
    pathTiles[index] = true;
  } else if (index <= 104 && index >= 92) {
    pathTiles[index] = true;
  } else if (!((index - 1) % 15)) {
    pathTiles[index] = true;
  } else if (!(index % 15)) {
    pathTiles[index] = true;
  }
}

//populate tileArray
for (let i = 0; i < tileCount; i++) {
  const tile = {};
  const index = i + 1;
  tile.id = index;
  const randomizer = Phaser.Math.Between(0, 6);
  if (pathTiles[index]) {
    tile.tileType = 'path';
    if (randomizer === 2 || randomizer == 4) {
      tile.actionType = 'good';
    } else if (randomizer === 3 || randomizer === 5) {
      tile.actionType = 'bad';
    } else {
      tile.actionType = 'neutral';
    }
  } else {
    tile.tileType = 'background';
    tile.actionType = null;
  }
  tileArray.push(tile);
}

export default tileArray;
