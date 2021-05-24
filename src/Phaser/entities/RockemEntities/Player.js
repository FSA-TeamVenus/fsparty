import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, spriteKey) {
    super(scene, x, y, texture, spriteKey);

    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }

  goCorner(spriteKey) {
    this.setX(100);
    this.anims.play(`idle_${spriteKey}`);
  }

  KO(spriteKey) {
    this.anims.play(`dizzy_${spriteKey}`)
      .once('animationcomplete', ()=> {
        this.anims.play(`ko_${spriteKey}`);
      })
  }

  updateMovement(key, spritePrefix) {
    // Walk Back
    if (key === 'walkback') {
      this.setVelocityX(-360);
      this.anims.play(`${key}_${spritePrefix}`, true);
    }
    // Walk
    else if (key === 'walk') {
      this.setVelocityX(360);
      this.anims.play(`${key}_${spritePrefix}`, true);
    }
    // Guard
    else if (key === 'guard') {
      this.setVelocityX(0);
      this.anims.play(`${key}_${spritePrefix}`);
    } 
    else if (key === 'punchleft') {
        this.anims.play(`${key}_${spritePrefix}`, true);
    }
    else if (key === 'punchright') {
      this.anims.play(`${key}_${spritePrefix}`, true);
    }
    else if (key === 'punchup') {
      this.anims.play(`${key}_${spritePrefix}`, true);
    }
    else if (key === 'hurt') {
      this.anims.play(`${key}_${spritePrefix}`, true);
    }
    else if (key === 'dizzy') {
      this.anims.play(`${key}_${spritePrefix}`, true);
    }
    else if (key === 'ko') {
      this.anims.play(`${key}_${spritePrefix}`, true);
    }
    else if (key === 'idle') {
      this.anims.play(`${key}_${spritePrefix}`, true);
    }
    // Neutral (no movement)
    else {
      this.setVelocityX(0);
      // Whenever Boxer1 is not moving, use the idle or guard animation
        this.anims.play(`idle_${spritePrefix}`);
        //this.anims.play('punchleft', true);
    }
  }
  /*
  //UPDATE MOVEMENT SAVED FOR 1 V 1 MODE
  updateMovement(cursors) {
    // Walk Back
    if (cursors.left.isDown) {
      this.setVelocityX(-360);
      this.play('walkback', true);
    }
    // Walk
    else if (cursors.right.isDown) {
      this.setVelocityX(360);
      this.play('walk', true);
    }
    // Guard
    else if (cursors.shift.isDown) {
      this.setVelocityX(0);
      this.anims.play('guard');
    } 
    else if (cursors.space.isDown) {
        this.anims.play('punchleft', true);
    }
    else if (cursors.up.isDown) {
      this.anims.play('punchup', true);
    }
    else if (cursors.down.isDown) {
      this.anims.play('punchright', true);
    }
    // Neutral (no movement)
    else {
      this.setVelocityX(0);
      // Whenever Boxer1 is not moving, use the idle or guard animation
        this.anims.play('idle');
        //this.anims.play('punchleft', true);
    }
  }
  */

  // Check which controller button is being pushed and execute movement & animation
  update(currentPoints) {
  //this.updateMovement(cursors);
    if(currentPoints === 0)
      this.startFight();
    if (currentPoints < 10) {
      this.punch();
    } else {
      this.idle();
    }
  }

}
