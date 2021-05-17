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
    this.facingLeft = false;
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
      if (!this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = true;
      }
      this.setVelocityX(-360);
      if (this.body.touching.down) {
        this.play('run', true);
      }
    } else if (cursors.right.isDown) {
      if (this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = false;
      }
      this.setVelocityX(360);
      if (this.body.touching.down) {
        this.play('run', true);
      }
    } else {
      this.setVelocityX(0);
      this.play('idle');
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
      this.play('jump', true);
    }
  }
}
