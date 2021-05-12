import Phaser from 'phaser';
import PlatformPlayer from '../entities/PlatformPlayer';
import Platform from '../entities/Platform';
import Coin from '../entities/Coin';

export default class PlatformGame extends Phaser.Scene {
  constructor() {
    super('platformGame');
  }

  preload() {
    this.load.spritesheet('player', '/public/assets/images/character.png', {
      frameWidth: 30,
      frameHeight: 30,
    });
    this.load.spritesheet('coin', '/public/assets/images/coins.png', {
      frameWidth: 15,
      frameHeight: 15,
    });
    this.load.image('platform', '/public/assets/images/2dplatform.png');
  }

  create() {
    //PLAYERS
    this.player = new PlatformPlayer(this, 200, 400, 'player')
      .setScale(3)
      .setSize(15, 32, true);
    //PLATFORMS
    this.platformGroup = this.physics.add.staticGroup({
      class: Platform,
    });
    //GAME OBJECTS
    this.coin = this.physics.add.staticGroup({
      class: Coin,
      key: 'coin',
      repeat: 5,
      setScale: { x: 1.5, y: 1.5 },
      setXY: { x: 200, y: 200, stepX: 200 },
    });

    //CURSORS

    this.cursors = this.input.keyboard.createCursorKeys();

    ///BASE LEVEL OF PLATFORMS

    this.createPlatform(150, 540);
    this.createPlatform(450, 540);
    this.createPlatform(700, 540);

    //COLLIDERS

    this.physics.add.collider(this.player, this.platformGroup);
  }

  createAnimations() {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { frame: 0 }),
      frameRate: 10,
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('coin', { frame: 0 }),
    });
  }

  update(time, delta) {
    this.player.update(this.cursors);
  }

  createPlatform(x, y) {
    const plat = this.platformGroup
      .create(x, y, 'platform')
      .setSize(340, 58)
      .setScale(0.25);
  }
}
