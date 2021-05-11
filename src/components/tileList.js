import Phaser from 'phaser';

const tileCount = 105;
const tileArray = [];
const pathTiles = {};

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
  const randomizer = Phaser.Math.Between(1, 6);
  if (pathTiles[index]) {
    tile.tileType = 'path';
    if (index === 1) {
      tile.actionType = 'neutral';
    } else if (randomizer % 2) {
      tile.actionType = 'good';
    } else {
      tile.actionType = 'bad';
    }
  } else {
    tile.tileType = 'background';
    tile.actionType = null;
  }
  tileArray.push(tile);
}

export default tileArray;
