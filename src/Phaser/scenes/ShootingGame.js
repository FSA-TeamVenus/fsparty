import Phaser from "phaser";
import { getShootingPlayers, updateReticlePos } from "../../Firebase/index";
import Player from "../entities/Player";

// setting playerId here temporarily until the main game can set it
window.localStorage.setItem("playerId", "1");
const myId = Number(window.localStorage.getItem("playerId"));
// or token

export default class ShootingGame extends Phaser.Scene {
  constructor() {
    super("shootingGame");

    // using an object to store players instead of a phaser group
    // so we can look up by id instead of iterating through an array
    this.otherPlayers = {};
    this.spawned = false;
  }

  preload() {
    this.load.spritesheet(
      "reticle",
      "../../public/assets/images/test-reticle.png",
      {
        frameWidth: 32,
        frameHeight: 16,
      }
    );
  }

  create() {
   getShootingPlayers(1, (playerList) => {
     //list of players
     console.log('player list --->', playerList);
    //  this.addPlayers(playerList);
   })
  }

  update() {
    //console.log(this.input.activePointer.position)
    if (this.myPlayer) {
      let position = this.myPlayer.x;
      console.log(position)
      if (
        this.myPlayer.oldPosition &&
        this.myPlayer.oldPosition.x !== position
      ) {
        updateReticlePos(1, myId, { x: this.myPlayer.x, y:this.myPlayer.y });
      }
      this.myPlayer.oldPositon = {
        x: this.myPlayer.x,
      };
    }
  }

  addPlayers(playerList) {
    const myPlayer = playerList.splice(myId, 1)
    for (let i = 0; i < playerList.length;i++) {
    const otherPlayer = playerList[i];
    const newPlayer = new Player(this, otherPlayer.x, otherPlayer.y, "reticle");
    this.otherPlayers[i] = newPlayer;
    }
    this.myPlayer = new Player(this, myPlayer.x, myPlayer.y, 'reticle');
  }
}


