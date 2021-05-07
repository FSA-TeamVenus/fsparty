import Phaser from 'phaser';
import config from './config/config';
import GameScreen from './scenes/GameScreen';

export class Game extends Phaser.Game {
  constructor() {
    super(config);

    // add scenes here
    this.scene.add('game', GameScreen);

    this.scene.start('game');
  }
}

// window.onload = function () {
//   window.game = new Game();
// };
