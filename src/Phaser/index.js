import Phaser from 'phaser';
import EndScreen from './scenes/EndScreen';
import RacingGame from './scenes/RacingGame';
import PlatformGame from './scenes/PlatformScenes/PlatformGame';
import StartScreen from './scenes/StartScreen';
import ShootingGame from './scenes/ShootingScenes/ShootingGame';
import RockemGame from './scenes/RockemScenes/RockemGame';
import BgScene from "./scenes/RockemScenes/BgScene";
import FgScene from "./scenes/RockemScenes/FgScene";

export class Game extends Phaser.Game {
  constructor(config, scene, instructions) {
    super(config, scene, instructions);

    // add scenes here
    this.nextScene = scene;
    this.instructions = instructions;

    this.scene.add('racingGame', RacingGame);
    this.scene.add('platformGame', PlatformGame);
    this.scene.add('shootingGame', ShootingGame);
    this.scene.add('startScreen', StartScreen);
    this.scene.add('endScreen', EndScreen);
    this.scene.add('rockemGame', RockemGame);
    this.scene.add('FgScene', FgScene);
    this.scene.add('BgScene', BgScene);

    this.scene.start('startScreen', {
      nextScene: this.nextScene,
      instructions: this.instructions,
    });
  }
}
