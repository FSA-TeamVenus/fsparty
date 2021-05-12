import 'phaser';

export default class PlatformPlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = true;
    this.scene.add.existing(this);
    this.setCollideWorldBounds(true);

    // this.oldPosition = {};
  }

  update(cursors) {
    this.updateMovement(cursors);
    this.updateJump(cursors);
  }

  updateMovement(cursors) {
    if (cursors.left.isDown) {
      this.setVelocityX(-360);
    } else if (cursors.right.isDown) {
      this.setVelocityX(360);
    } else {
      this.setVelocityX(0);
    }
  }

  updateJump(cursors) {
    if (cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-800);
    }
  }
}
