import Phaser from 'phaser';

export default class GameObject extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
  }
}
