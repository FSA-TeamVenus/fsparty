import Phaser from "phaser";
import {
  getShootingPlayers,
  getOtherReticles,
  updateReticlePos,
  updateShootingScore,
  getTargets,
  updateTarget,
} from "../../../Firebase/index";

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

  // init() {
  //   // this.initY = { 0: 400, 1: 300, 2: 200, 3: 100 };
  //   // this.initX = 32;
  // }

  preload() {
    this.gameId = Number(window.localStorage.getItem("gameId"));
    this.myId = Number(window.localStorage.getItem("idKey"));
    this.load.image("ghost", "assets/images/ghost.png");
    this.load.image("reticle", "assets/images/test-reticle.png");
  }

  create() {
    getShootingPlayers(this.gameId, this.addPlayers);
    this.input.setDefaultCursor("url(assets/images/crosshair.cur),pointer");
    for (let i = 0; i < 5; i++) {
      // const xx = Phaser.Math.Between(300)
      const yy = 100 + i * 110;
      this[`ghost${i}`] = this.add.image(400, yy, "ghost").setScale(0.1);
      this[`ghost${i}`].index = i;
      this[`ghost${i}`].setInteractive();
    }
    window.scene = this;
    this.input.on("gameobjectdown", this.shot.bind(this));
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
        if (player.score) this.allPlayers[player.playerId] = { name: player.name, score:player.score }
        else this.allPlayers[player.playerId] = { name: player.name, score: 0 }
      }
    }
//checking if each target gameId/shootingGame/targets/targetId/hit = true || false before target.setVisible(true || false)
  checkTargets(targObj) {
    for (let target in targObj) {
        let targStatus = targObj[target];
        let targGameObj = this[`ghost${target}`];
        if (targStatus.hit == true) {
          if(targGameObj) targGameObj.setVisible(false);
        }
        else {
          if (targGameObj) {
            targGameObj.setVisible(true);
          }
        }
      }
  }

  shot(pointer, target) {
    console.log(`hit - ${target.index}`)
    //should set firebase gameId/shootingGame/targets/targetId/hit = true
    updateTarget(this.gameId, target.index, true)
    this.myScore++;
    updateShootingScore(
      this.gameId,
      this.myId,
      this.myScore
    );
    //make hit sound

  }

  moveTarget(target, speed) {
    target.x += speed;
    if (target.x > 800 || target.x < 0) this.resetTarget(target, speed)
  }
  moveReticle(x, y) {

  }
  resetTarget(target, direction) {
    if (direction > 0) target.x = 0;
    else if (direction < 0) target.x = 800;
    if (this.myId == 0) updateTarget(this.gameId, target.index);
    // target.setVisible(true)

  }
  displayTargets(targObj) {

  }

  update() {
      this.moveTarget(this.ghost1, -1);
      this.moveTarget(this.ghost2, 2)
      this.moveTarget(this.ghost3, -3)
  }
}

//   preload() {
//     // this.load.spritesheet(
//     //   "reticle",
//     //   "../../public/assets/images/test-reticle.png",
//     //   {
//     //     frameWidth: 190,
//     //     frameHeight: 190,
//     //   }
//     // );
//     this.load.image('reticle', '../../public/assets/images/test-reticle.png');
//   }

//   create() {
//    getShootingPlayers(1, (playerList) => {
//      //list of players
//      console.log('player list --->', playerList);
//      this.addPlayers(playerList);
//    })
//   }

//   update() {
//     updateReticlePos(1, myId, {
//       x: this.input.mousePointer.worldX,
//       y: this.input.mousePointer.worldY,
//     });
//     this.input.mousePointer.
//   }

//   addPlayers(playerList) {
//     const myPlayer = playerList.splice(myId, 1)
//     console.log(myPlayer)
//     // for (let i = 0; i < playerList.length;i++) {
//     // const otherPlayer = playerList[i];
//     // const newPlayer = new Player(this, otherPlayer.x, otherPlayer.y, "reticle");
//     // this.otherPlayers[i] = newPlayer;
//     // }
//     // this.myPlayer = new PlayerReticle(this, myPlayer.x, myPlayer.y, 'reticle');
//   }
// }



