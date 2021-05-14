import 'phaser';

export default class DesertBg extends Phaser.Scene {
  constructor() {
    super('DesertBg');
  }

  preload() {
    this.load.image('desert', 'public/assets/images/Desert.png');
  }

  create() {
    this.add.image(-160, 0, 'desert').setOrigin(0);
  }
}
