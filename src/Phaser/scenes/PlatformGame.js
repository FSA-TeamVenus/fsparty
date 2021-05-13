import Phaser from 'phaser';
import PlatformPlayer from '../entities/PlatformPlayer';
import Platform from '../entities/Platform';
import Coin from '../entities/Coin';
import { platformPlayers, serverCoins } from '../../Firebase/index';

window.localStorage.setItem('playerId', '1');
const myId = Number(window.localStorage.getItem('playerId'));

export default class PlatformGame extends Phaser.Scene {
  constructor() {
    super('platformGame');

    this.getCoins = this.getCoins.bind(this);
    this.spawned = false;
    this.allPlayers = {};
    this.coinPouch = {};
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
    this.players = this.add.group();
    this.serverPlayers = platformPlayers;

    // get players from the database - this could maybe get replaced with a one time call // basically a get request
    this.serverPlayers.on('value', (snapshot) => {
      const list = snapshot.val();
      if (!this.spawned) {
        this.addPlayers(list);
        this.spawned = true;
      }
    });

    // listen for player movement udpdates
    this.serverPlayers.on('child_changed', (snapshot) => {
      const player = snapshot.val();
      if (player.playerId !== myId) {
        const player2update = this.allPlayers[player.playerId];
        player2update.x = player.x;
        player2update.y = player.y;
      }
    });

    //listen for coin updates
    serverCoins.on('child_changed', (snapshot) => {
      const coin = snapshot.val();
      if (this.coinPouch[coin.id]) {
        this.coinPouch[coin.id].disableBody(true, true);
      }
    });
    //PLATFORMS
    this.platformGroup = this.physics.add.staticGroup({
      class: Platform,
    });
    //GAME OBJECTS
    //COINS
    this.coins = this.add.group();
    this.generateCoins();

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
    // for (let i = 0; i < 10000; i++) {
    //   this.cameras.main.y += 1;
    // }

    //COLLIDERS

    this.physics.add.collider(this.players, this.platformGroup);

    //OVERLAPS

    this.physics.add.overlap(
      this.players,
      this.coins,
      this.getCoins,
      null,
      this
    );

    //SCOREBOARD
    this.score = 0;
    this.scoreText;
    this.scoreText = this.add.text(0, 18, 'Points: 0', {
      fontSize: '20px',
      fill: 'white',
    });
    this.scoreText.setScrollFactor(0, 0);
  }

  generateCoins() {
    let initX = 0;
    let initY = 200;

    for (let i = 0; i < 35; i++) {
      let first = i + 1;
      let coin = new Coin(this, initX, initY, 'coin');
      coin.id = i;
      if (first % 5 === 0) {
        initY -= 250;
        initX = 0;
      }
      initX += 200;
      this.coins.add(coin);
      this.coinPouch[coin.id] = coin;
    }
  }

  getCoins(player, coin) {
    coin.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Points: ' + this.score);
    serverCoins.child(`${coin.id}`).update({ collected: true });
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
    if (this.player) {
      this.player.update(this.cursors);
      this.isPlayerDead();
      const y = Math.floor(this.player.y);
      let position = {
        x: this.player.x,
        y: y,
      };
      if (
        (this.player.oldPosition && this.player.oldPosition.x !== position.x) ||
        this.player.oldPosition.y !== position.y
      ) {
        this.serverPlayers.child(`${myId}`).update({ x: this.player.x, y: y });
      }
      this.player.oldPositon = {
        x: this.player.x,
        y: y,
      };
    }
  }

  isPlayerDead() {
    if (this.player.isDead === true) {
      this.player.isDead = false;
      this.time.addEvent({
        delay: 3000,
        callback: () => {
          this.player.reset(200, 400);
        },
        callbackScope: this,
        loop: false,
      });
    }
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
    this.player = new PlatformPlayer(this, player.x, player.y, 'player')
      .setScale(3)
      .setSize(15, 32, true);
    this.player.playerId = myId;
    this.allPlayers[player.playerId] = this.player;
    this.players.add(this.player);
  }

  spawnOtherCharacters(player) {
    const newPlayer = new PlatformPlayer(this, player.x, player.y, 'player')
      .setScale(3)
      .setSize(15, 32, true);
    newPlayer.playerId = player.playerId;
    this.allPlayers[player.playerId] = newPlayer;
    this.players.add(newPlayer);
  }
}
