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
    for (let i = 1; i < 4;i++) {
      // const xx = Phaser.Math.Between(300)
      const yy = 100 + (i * 110)
      this[`ghost${i}`] = this.add.image(400, yy, 'ghost').setScale(.10)
      this[`ghost${i}`].index = i;
      this[`ghost${i}`].setInteractive();
    }
    console.log(this.ghost1.__proto__)
    window.scene = this;
    this.input.on('gameobjectdown', this.shot.bind(this))
  }

  shot(pointer, target) {
    console.log(`hit - ${target.index}`)
    //should set firebase isShot property
    target.setVisible(false)
    //increment score on firerbase or locally?
  }

  moveTarget(target, speed) {
    target.x += speed;
    if (target.x > 800 || target.x < 0) this.resetTarget(target, speed)
  }
  resetTarget(target, direction) {
    if (direction > 0) target.x = 0;
    else target.x = 800;
    target.setVisible(true)
  }

  update() {
    //check if each target has been shot and setVisible(false)
    this.moveTarget(this.ghost1, -1)
    this.moveTarget(this.ghost2, 2)
    this.moveTarget(this.ghost3, -3)
  }
}
