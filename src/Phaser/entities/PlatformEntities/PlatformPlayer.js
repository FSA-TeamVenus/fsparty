import 'phaser';

export default class PlatformPlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = true;
    this.scene.add.existing(this);
    this.body.setBounce(0.3);
    this.isDead = false;
    this.reset(x, y);
    this.oldPosition = {};
  }

  update(cursors, jumpSound) {
    this.updateMovement(cursors);
    this.updateJump(cursors, jumpSound);
    if (this.y > 650) {
      this.isDead = true;
      this.setActive(false);
      this.setVisible(false);
    }
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

  reset(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
  }

  updateJump(cursors, jumpSound) {
    if (cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-800);
      jumpSound.play();
    }
  }
}
