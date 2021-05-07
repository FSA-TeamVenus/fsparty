import Phaser from 'phaser';
import Player from '../entities/Player';

export default class GameScreen extends Phaser.Scene {
  constructor() {
    super('gameScreen');
  }

  preload() {
    this.load.spritesheet('car', '../../public/assets/images/race_car.png', {
      frameWidth: 32,
      frameHeight: 16,
    });
  }

  create() {
    this.anims.create({
      key: 'car_anim',
      frames: [{ key: 'car', frame: 0 }],
      frameRate: 20,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = new Player(this, 10, 550, 'car');
    this.player.play('car_anim');
  }

  update() {
    this.player.update(this.cursors);
  }
}
