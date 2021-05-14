import Phaser from 'phaser';
import config from './config/config';
import EndScreen from './scenes/EndScreen';
import RacingGame from './scenes/RacingGame';
import PlatformGame from './scenes/PlatformScenes/PlatformGame';
import platformConfig from './config/platformConfig';
import DesertBg from './scenes/PlatformScenes/DesertBg';

export class Game extends Phaser.Game {
  constructor() {
    super(platformConfig);

    // add scenes here
    // this.scene.add('racingGame', RacingGame);

    // this.scene.start('racingGame');
    this.scene.add('DesertBg', DesertBg);
    this.scene.add('platformGame', PlatformGame);
    this.scene.start('platformGame');
  }
}
