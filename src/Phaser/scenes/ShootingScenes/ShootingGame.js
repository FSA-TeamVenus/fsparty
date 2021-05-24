import Phaser from "phaser";
import {
  getShootingPlayers,
  updateShootingScore,
  getTargets,
  updateTarget,
} from "../../../Firebase/index";

const colors = {
  red: 0xf92831,
  blue: 0x4056ff,
  green: 0x4d901e,
  yellow: 0xf9eb30,
};

export default class ShootingGame extends Phaser.Scene {
  constructor() {
    super("shootingGame");
    this.allPlayers = {};
    this.spawned = false;
    this.myScore = 0;
    this.gameId;
    this.myId;
    this.checkTargets = this.checkTargets.bind(this);
    this.addPlayers = this.addPlayers.bind(this);
  }

  preload() {
    this.gameId = Number(window.localStorage.getItem("gameId"));
    this.myId = Number(window.localStorage.getItem("idKey"));

    this.load.image("inv-0", "assets/images/invader-0.png");
    this.load.image("inv-1", "assets/images/invader-1.png");
    this.load.image("inv-2", "assets/images/invader-2.png");

    this.load.audio("shot", "assets/images/sounds/laser.wav");
    this.load.audio("boom", "assets/images/sounds/explosion.wav");

    getShootingPlayers(this.gameId, this.addPlayers);
  }

  create() {
    // getOtherReticles(this.gameId, console.log());
    this.gunshot = this.sound.add("shot");
    this.explosion = this.sound.add("boom");


    // getOtherReticles(this.gameId, this.displayOtherPlayers)
    this.input.setDefaultCursor(`url(assets/images/${this.myColor}-crosshair.cur),pointer`);

    for (let i = 0; i < 6; i++) {
      const xx = Phaser.Math.Between(1, 799)
      const yy = Phaser.Math.Between(1, 599)
      // const xx = 100 + i * 110
      // const yy = 100 + i * 110;
      this[`inv-${i}`] = this.add.image(xx, yy, `inv-${i % 2}`).setScale(0.1);
      this[`inv-${i}`].index = i;
      this[`inv-${i}`].setInteractive();
    }
    window.scene = this;
    this.input.on("gameobjectdown", this.shot.bind(this));
    this.input.on("pointerdown", () => this.gunshot.play());
    getTargets(this.gameId, this.checkTargets);

    //TIMER
    this.time.addEvent({

      delay: 20000,
      callback: () => {
        getShootingPlayers(this.gameId, this.addPlayers);
        console.log(this.allPlayers)
        const finishers = [];
        Object.keys(this.allPlayers).forEach((key) => finishers.push(key));
        finishers.sort((a, b) => a.score - b.score);
        this.scene.start('endScreen', {
          gameId: this.gameId,
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
        if (player.score) this.allPlayers[player.playerId] = { ...player }
        else if (!player.score) this.allPlayers[player.playerId] = { ...player, score: 0 }
        if (player.playerId === this.myId) {
          this.myColor = player.color
        }
      }
    }

//checking if each target gameId/shootingGame/targets/targetId/hit = true || false before target.setVisible(true || false)
  checkTargets(targObj) {
    for (let target in targObj) {
        let targStatus = targObj[target];
        let targGameObj = this[`inv-${target}`];

        if (targStatus.hit == true) {
          //timeout to toggle shooters color before making invisible
          if(targGameObj){
            let hex = colors[`${targStatus.shooter}`]
            targGameObj.setTint(hex);
            this.explosion.play();
            setTimeout(()=> {
              targGameObj.setVisible(false);
              // this.explosion.play();
            }, 300)
          }
        }
        else {
          if (targGameObj) {
            targGameObj.setVisible(true);
            targGameObj.setTint(0xffffff);
          }
        }
      }
  }

  shot(pointer, target) {
    console.log(`hit - ${target.index}`)
    console.log(this.myColor)
    // const myColor = this.allPlayers[this.myId].color;
    //should set firebase gameId/shootingGame/targets/targetId/hit = true
    updateTarget(this.gameId, target.index, this.myColor)
    this.myScore++;
    //update with shootier info
    updateShootingScore(
      this.gameId,
      this.myId,
      this.myScore
    );
  }

  moveTarget(target, speed) {
    target.x += speed;
    if (target.x > 800 || target.x < 0) this.resetTarget(target, speed)
  }

  resetTarget(target, direction) {
    if (direction > 0) target.x = 0;
    else if (direction < 0) target.x = 800;
    if (this.myId == 0) updateTarget(this.gameId, target.index);
  }

  update() {
      this.moveTarget(this['inv-0'], -5);
      this.moveTarget(this['inv-1'], 3);
      this.moveTarget(this['inv-2'], -2);
      this.moveTarget(this['inv-3'], -3);
      this.moveTarget(this['inv-4'], 3);
      this.moveTarget(this['inv-5'], -5);
  }
}


