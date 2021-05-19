import Phaser from "phaser";
import {
  getShootingPlayers,
  getOtherReticles,
  updateReticlePos,
} from "../../../Firebase/index";

export default class ShootingGame extends Phaser.Scene {
  constructor() {
    super("shootingGame");

    this.allPlayers = {};
    this.spawned = false;
    this.gameId;
    this.myId;

  }

  // init() {
  //   this.initY = { 0: 400, 1: 300, 2: 200, 3: 100 };
  //   this.initX = 32;
  // }

  preload() {
    this.gameId = Number(window.localStorage.getItem("gameId"));
    this.myId = Number(window.localStorage.getItem("idKey"));
    this.load.image("ghost", "assets/images/ghost.png");
  }

  create() {
    for (let i = 1; i < 3;i++) {
      let ghost = this.add.image(0, 0, 'ghost').setScale(.25)
    }
    window.scene = this;
  }

  update() {

  }
}
