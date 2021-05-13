import Phaser from 'phaser';
import config from './config/config';
import RacingGame from './scenes/RacingGame';
import ShootingGame from './scenes/ShootingGame';

export class Game extends Phaser.Game {
  constructor() {
    super(config);

    // add scenes here
    this.scene.add('racingGame', RacingGame);
    this.scene.add('shootingGame', ShootingGame);

    this.scene.start('shootingGame');
  }
}
