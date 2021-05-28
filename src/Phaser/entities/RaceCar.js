import Phaser from 'phaser';

export default class RaceCar extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.scene.add.existing(this);
    // this.setCollideWorldBounds(true);
    this.setDamping(true);
    this.setDragX(0.4);
    this.ignition = false;
    this.playerId;
    this.oldPosition = {};
  }
}
