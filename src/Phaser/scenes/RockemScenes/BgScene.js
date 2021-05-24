import 'phaser';

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    // Preload Sprites
    this.load.image('boxingring', 'assets/rockemGame/backgrounds/boxingring.jpg');
    this.load.image('logo', 'assets/rockemGame/backgrounds/RockemLogo.png')
  }

  create() {
    // Create Sprites
    // Background
    this.add.image(-140, 30, 'boxingring').setOrigin(0).setScale(.18);
    this.add.image(410,85,'logo').setScale(.25)
  }
}
