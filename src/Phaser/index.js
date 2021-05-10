import Phaser from 'phaser';
import config from './config/config';
import RacingGame from './scenes/RacingGame';

export class Game extends Phaser.Game {
  constructor() {
    super(config);

    // add scenes here
    this.scene.add('racingGame', RacingGame);

    this.scene.start('racingGame');
  }
}
