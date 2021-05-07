import Phaser from 'phaser';
import Player from '../entities/Player';

export default class GameScreen extends Phaser.Scene {
  constructor() {
    super('gameScreen');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = new Player(this, 10, 550, 'car');
  }

  update() {
    this.player.update(this.cursors);
  }
}
