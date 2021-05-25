import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game-canvas',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 },
      debug: true,
    },
  },
  render: {
    pixelArt: true,
  },
};
