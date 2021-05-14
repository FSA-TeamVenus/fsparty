import Phaser from "phaser";
import { getShootingPlayers, updateReticlePos } from "../../Firebase/index";
import PlayerReticle from "../entities/PlayerReticle";

// setting playerId here temporarily until the main game can set it
window.localStorage.setItem("playerId", "3");
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
    // this.load.spritesheet(
    //   "reticle",
    //   "../../public/assets/images/test-reticle.png",
    //   {
    //     frameWidth: 190,
    //     frameHeight: 190,
    //   }
    // );
    this.load.image('reticle', '../../public/assets/images/test-reticle.png');
  }

  create() {
   getShootingPlayers(1, (playerList) => {
     //list of players
     console.log('player list --->', playerList);
     this.addPlayers(playerList);
   })
  }

  update() {
    updateReticlePos(1, myId, {
      x: this.input.mousePointer.worldX,
      y: this.input.mousePointer.worldY,
    });
    this.input.mousePointer.
  }

  addPlayers(playerList) {
    const myPlayer = playerList.splice(myId, 1)
    console.log(myPlayer)
    // for (let i = 0; i < playerList.length;i++) {
    // const otherPlayer = playerList[i];
    // const newPlayer = new Player(this, otherPlayer.x, otherPlayer.y, "reticle");
    // this.otherPlayers[i] = newPlayer;
    // }
    // this.myPlayer = new PlayerReticle(this, myPlayer.x, myPlayer.y, 'reticle');
  }
}


