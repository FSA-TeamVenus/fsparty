export default class Opponent extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, spriteKey) {
        super(scene, x, y, texture, spriteKey);
        // Store reference of scene passed to constructor
        this.scene = scene;

        // Add opponent to scene and enable physics
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        // Turn him around to face player
        this.flipX = !this.flipX;

        this.playedSound = false;
    }

    goCorner(spriteKey) {
      this.setX(600);
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
      else if (key === 'ide;') {
        this.anims.play(`${key}_${spritePrefix}`, true);
      }
      // Neutral (no movement)
      else {
        this.setVelocityX(0);
        // Whenever Boxer is not moving, use the idle animation
          this.anims.play(`idle_${spritePrefix}`);
      }
    }

    update(defeatSound) {
        if (this.y > 600 && !this.playedSound) {
          this.playedSound = true;
          defeatSound.play();
        }
      }
}