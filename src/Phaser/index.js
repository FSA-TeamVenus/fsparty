import Phaser from 'phaser';
import EndScreen from './scenes/EndScreen';
import RacingGame from './scenes/RacingGame';
import PlatformGame from './scenes/PlatformScenes/PlatformGame';
import StartScreen from './scenes/StartScreen';
// import ShootingGame from './scenes/ShootingGame';

export class Game extends Phaser.Game {
  constructor(config, scene, instructions) {
    super(config, scene, instructions);

    // add scenes here
    this.nextScene = scene;
    this.instructions = instructions;

    this.scene.add('racingGame', RacingGame);
    this.scene.add('platformGame', PlatformGame);
    this.scene.add('startScreen', StartScreen);
    this.scene.add('endScreen', EndScreen);

    this.scene.start('startScreen', {
      nextScene: this.nextScene,
      instructions: this.instructions,
    });
  }
}
