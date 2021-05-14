import Phaser from 'phaser';
import config from './config/config';
import EndScreen from './scenes/EndScreen';
import RacingGame from './scenes/RacingGame';
import PlatformGame from './scenes/PlatformScenes/PlatformGame';
import platformConfig from './config/platformConfig';
// import ShootingGame from './scenes/ShootingGame';

export class Game extends Phaser.Game {
  constructor() {
    super(platformConfig);

    // add scenes here
    // this.scene.add('racingGame', RacingGame);
    // this.scene.add('racingGame', RacingGame);
    // this.scene.add('shootingGame', ShootingGame);
    // this.scene.add('endScreen', EndScreen);

    // this.scene.start('racingGame');

    this.scene.add('platformGame', PlatformGame);
    this.scene.start('platformGame');
  }

  create() {
    this.scene.launch(DesertBg);
  }
}
