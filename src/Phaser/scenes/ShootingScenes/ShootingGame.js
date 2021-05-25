import Phaser from 'phaser';
import {
  getShootingPlayers,
  updateShootingScore,
  getTargets,
  updateTarget,
  resetTarget,
} from '../../../Firebase/index';

const colors = {
  red: 0xf92831,
  blue: 0x4056ff,
  green: 0x4d901e,
  yellow: 0xf9eb30,
  orange: 0xff5322,
  pink: 0xe265ff,
};

export default class ShootingGame extends Phaser.Scene {
  constructor() {
    super('shootingGame');
    this.allPlayers = {};
    this.spawned = false;
    this.myScore = 0;
    this.gameId;
    this.myId;
    this.checkTargets = this.checkTargets.bind(this);
    this.addPlayers = this.addPlayers.bind(this);
  }

  preload() {
    this.gameId = Number(window.localStorage.getItem('gameId'));
    this.myId = Number(window.localStorage.getItem('idKey'));

    this.load.image('spaceBg', 'assets/shootingGame/spaceBg.png');

    this.load.image('inv-0', 'assets/shootingGame/invader-0.png');
    this.load.image('inv-1', 'assets/shootingGame/invader-1.png');
    this.load.image('inv-2', 'assets/shootingGame/invader-2.png');

    this.load.audio('shot', 'assets/shootingGame/laser.wav');
    this.load.audio('boom', 'assets/shootingGame/explosion.wav');

    getShootingPlayers(this.gameId, this.addPlayers);
  }

  create() {
    // getOtherReticles(this.gameId, console.log());
    this.gunshot = this.sound.add('shot');
    this.explosion = this.sound.add('boom');

    this.background = this.add.image(400, 300, 'spaceBg').setScale(4);
    this.input.setDefaultCursor(
      `url(assets/shootingGame/${this.myColor}-crosshair.cur),pointer`
    );

    this.scoreText = this.add.text(18, 18, 'Ships Destroyed: 0', {
      fontSize: '25px',
      fill: `${this.myColor}`,
    });

    for (let i = 0; i < 10; i++) {
      const xx = 100 + i * 110;
      const yy = (100 + i * 110) % 600;
      this[`inv-${i}`] = this.add.image(xx, yy, `inv-${i % 3}`).setScale(0.1);
      this[`inv-${i}`].index = i;
      this[`inv-${i}`].setInteractive();
    }

    window.scene = this;

    this.input.on('gameobjectdown', this.shot.bind(this));
    this.input.on('pointerdown', () => this.gunshot.play());
    getTargets(this.gameId, this.checkTargets);

    //TIMER
    this.time.addEvent({
      delay: 20000,
      callback: () => {
        getShootingPlayers(this.gameId, this.addPlayers);
        console.log(this.allPlayers);
        const finishers = [];
        Object.keys(this.allPlayers).forEach((key) => finishers.push(key));
        finishers.sort((a, b) => a.score - b.score);
        this.scene.start('endScreen', {
          gameId: this.gameId,
          playerId: this.myId,
          allPlayers: this.allPlayers,
          finishers: finishers,
        });
      },
      callbackScope: this,
      loop: false,
    });
  }

  //add players
  addPlayers(playersObj) {
    for (let player of playersObj) {
      if (player.score) this.allPlayers[player.playerId] = { ...player };
      else if (!player.score)
        this.allPlayers[player.playerId] = { ...player, score: 0 };
      if (player.playerId === this.myId) {
        this.myColor = player.color;
      }
    }
  }

  checkTargets(targObj) {
    for (let target in targObj) {
      let targStatus = targObj[target];
      let targGameObj = this[`inv-${target}`];
      if (targStatus.hit == true) {
        if (targGameObj) {
          let hex = colors[`${targStatus.shooter}`];
          targGameObj.setTint(hex);
          if (targStatus.destroyed == true) {
            resetTarget(this.gameId, target, true);
            setTimeout(() => {
              targGameObj.setVisible(false);
              this.explosion.play();
            }, 250);
          }
        }
      } else {
        if (targGameObj) {
          targGameObj.setVisible(true);
          targGameObj.setTint(0xffffff);
        }
      }
    }
  }

  shot(pointer, target) {
    console.log(`hit - ${target.index}`);
    //should set firebase gameId/shootingGame/targets/targetId/hit = true
    updateTarget(this.gameId, target.index, this.myColor);
    this.myScore++;
    this.scoreText.setText('Ships Destroyed: ' + this.myScore);
    //update with shootier info
    updateShootingScore(this.gameId, this.myId, this.myScore);
  }

  moveTarget(target, speed) {
    target.x += speed;
    if (target.x > 800 || target.x < 0) this.resetTarget(target, speed);
  }

  resetTarget(target, direction) {
    if (direction > 0) target.x = 0;
    else if (direction < 0) target.x = 800;
    if (this.myId == 0) resetTarget(this.gameId, target.index);
  }

  update() {
    this.moveTarget(this['inv-0'], 3);
    this.moveTarget(this['inv-1'], -4);
    this.moveTarget(this['inv-2'], -2);
    this.moveTarget(this['inv-3'], 3);
    this.moveTarget(this['inv-4'], -4);
    this.moveTarget(this['inv-5'], -2);
    this.moveTarget(this['inv-6'], 3);
    this.moveTarget(this['inv-7'], -4);
    this.moveTarget(this['inv-8'], -2);
    this.moveTarget(this['inv-9'], 3);
  }
}
