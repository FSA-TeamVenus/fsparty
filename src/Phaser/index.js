import Phaser from 'phaser';
import config from './config/config';
import EndScreen from './scenes/EndScreen';
import RacingGame from './scenes/RacingGame';

export class Game extends Phaser.Game {
  constructor() {
    super(config);

    // add scenes here
    this.scene.add('racingGame', RacingGame);
    this.scene.add('endScreen', EndScreen);

    this.scene.start('racingGame');
  }
}
