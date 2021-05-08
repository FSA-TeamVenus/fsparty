import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.setCollideWorldBounds(true);
    this.scene.add.existing(this);
    this.setDamping(true);
    this.setDragX(0.25);
    this.playerId;
    this.oldPosition = {};
  }

  // update(cursors) {
  // const duration = cursors.space.getDuration();
  // if (cursors.space.isDown && duration < 50) {
  //   this.x += 5;
  //   console.log(this.x);
  // }
  // }
}
