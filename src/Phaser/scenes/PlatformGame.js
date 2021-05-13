import Phaser from 'phaser';
import PlatformPlayer from '../entities/PlatformPlayer';
import Platform from '../entities/Platform';
import Coin from '../entities/Coin';

window.localStorage.setItem('playerId', '1');
const myId = Number(window.localStorage.getItem('playerId'));

export default class PlatformGame extends Phaser.Scene {
  constructor() {
    super('platformGame');

    this.getCoins = this.getCoins.bind(this);
    this.spawned = false;
    this.otherPlayers = {};
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
    // this.player = new PlatformPlayer(this, 200, 400, 'player')
    //   .setScale(3)
    //   .setSize(15, 32, true);
    //PLATFORMS
    this.platformGroup = this.physics.add.staticGroup({
      class: Platform,
    });
    //GAME OBJECTS
    //COINS
    this.coinGroupOne = this.physics.add.staticGroup({
      class: Coin,
      key: 'coin',
      repeat: 5,
      setScale: { x: 1.75, y: 1.75 },
      setXY: { x: 0, y: 200, stepX: 200 },
    });
    this.coinGroupTwo = this.physics.add.staticGroup({
      class: Coin,
      key: 'coin',
      repeat: 3,
      setScale: { x: 1.75, y: 1.75 },
      setXY: { x: 0, y: -50, stepX: 200 },
    });
    this.coinGroupThree = this.physics.add.staticGroup({
      class: Coin,
      key: 'coin',
      repeat: 5,
      setScale: { x: 1.75, y: 1.75 },
      setXY: { x: 0, y: -300, stepX: 200 },
    });
    this.coinGroupFour = this.physics.add.staticGroup({
      class: Coin,
      key: 'coin',
      repeat: 3,
      setScale: { x: 1.75, y: 1.75 },
      setXY: { x: 0, y: -550, stepX: 200 },
    });
    this.coinGroupFive = this.physics.add.staticGroup({
      class: Coin,
      key: 'coin',
      repeat: 3,
      setScale: { x: 1.75, y: 1.75 },
      setXY: { x: 0, y: -800, stepX: 200 },
    });
    this.coinGroupSix = this.physics.add.staticGroup({
      class: Coin,
      key: 'coin',
      repeat: 3,
      setScale: { x: 1.75, y: 1.75 },
      setXY: { x: 0, y: -1050, stepX: 200 },
    });
    this.coinGroupSeven = this.physics.add.staticGroup({
      class: Coin,
      key: 'coin',
      repeat: 3,
      setScale: { x: 1.75, y: 1.75 },
      setXY: { x: 0, y: -1300, stepX: 200 },
    });

    //CURSORS

    this.cursors = this.input.keyboard.createCursorKeys();

    ///BASE LEVEL OF PLATFORMS

    this.createPlatform(150, 550);
    this.createPlatform(450, 550);
    this.createPlatform(700, 550);

    //SECOND LEVEL
    this.createPlatform(150, 300);
    this.createPlatform(700, 300);
    this.createPlatform(450, 50);

    //THIRD LEVEL
    this.createPlatform(150, -200);
    this.createPlatform(700, -200);
    this.createPlatform(450, -450);

    //FOURTH LEVEL
    this.createPlatform(150, -700);
    this.createPlatform(700, -700);
    this.createPlatform(450, -950);

    //FIFTH LEVEL
    this.createPlatform(150, -1200);
    this.createPlatform(700, -1200);
    this.createPlatform(450, -1450);

    //CAMERA SETTINGS
    // this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
    for (let i = 0; i < 10000; i++) {
      this.cameras.main.y += 1;
    }

    //COLLIDERS

    this.physics.add.collider(this.player, this.platformGroup);

    //OVERLAPS

    this.physics.add.overlap(
      this.player,
      this.coinGroupOne,
      this.getCoins,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.coinGroupTwo,
      this.getCoins,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.coinGroupThree,
      this.getCoins,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.coinGroupFour,
      this.getCoins,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.coinGroupFive,
      this.getCoins,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.coinGroupSix,
      this.getCoins,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.coinGroupSeven,
      this.getCoins,
      null,
      this
    );

    //SCOREBOARD
    this.score = 0;
    this.scoreText;
    this.scoreText = this.add.text(80, 18, 'Points: 0', {
      fontSize: '32px',
      fill: 'white',
    });
    this.scoreText.setScrollFactor(0, 0);
  }

  getCoins(player, coin) {
    coin.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Points: ' + this.score);
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

  addPlayers(data) {
    data.forEach((player) => {
      if (player.playerId === myId) {
        this.spawnMyCharacter(player);
      } else this.spawnOtherCharacters(player);
    });
  }

  spawnMyCharacter(player) {
    this.myCharacter = new PlatformPlayer(this, player.x, player.y, 'player')
      .setScale(3)
      .setSize(15, 32, true);
    this.myCharacter.playerId = myId;
  }
}
