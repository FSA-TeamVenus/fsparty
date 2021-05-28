import Phaser from 'phaser';
import {
  playersRef,
  getRacingGamePlayers,
  updateRacingGamePlayers,
} from '../../Firebase/index';
import RaceCar from '../entities/RaceCar';

export default class RacingGame extends Phaser.Scene {
  constructor() {
    super('racingGame');

    this.allPlayers = {};
    this.spawned = false;
    this.gameId;
    this.myId;
    this.finishers = [];

    this.addPlayers = this.addPlayers.bind(this);
    this.spawnMyCharacter = this.spawnMyCharacter.bind(this);
    this.spawnOtherCharacter = this.spawnOtherCharacter.bind(this);
    this.managePlayers = this.managePlayers.bind(this);
    this.updateOtherPlayers = this.updateOtherPlayers.bind(this);
  }

  init() {
    this.initY = { 0: 450, 1: 350, 2: 250, 3: 150 };
    this.initX = 50;
  }

  preload() {
    this.load.spritesheet('car', 'assets/images/racecar_top.png', {
      frameWidth: 32,
      frameHeight: 16,
    });
    this.load.image('finish_line', 'assets/images/finish_line_600.png');
    this.load.image('racingMap', 'assets/images/racing_tileset_grey.png');
    this.load.audio('beep', 'assets/audio/beep.wav');
    this.load.audio('go', 'assets/audio/go.wav');
    this.gameId = Number(window.localStorage.getItem('gameId'));
    this.myId = Number(window.localStorage.getItem('idKey'));
  }

  create() {
    this.players = this.add.group();
    this.createSprites();
    this.managePlayers();
    this.playersRef = playersRef(this.gameId, 'racingGame');

    const level = [
      [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3],
      [4, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 2],
      [4, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 2],
      [4, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 2],
      [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3],
    ];

    const map = this.make.tilemap({
      data: level,
      tileWidth: 100,
      tileHeight: 100,
    });
    const tiles = map.addTilesetImage('racingMap');
    map.createLayer(0, tiles, 0, 0);

    this.finishLine = this.physics.add.image(1450, 300, 'finish_line');
    this.blocker = this.physics.add.image(1620, 400, 'finish_line');
    this.finishLine.body.allowGravity = false;
    this.blocker.body.allowGravity = false;
    this.blocker.setImmovable(true);
    this.beep = this.sound.add('beep');
    this.go = this.sound.add('go');

    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.spaceBar.on('down', () => {
      if (this.myCharacter.ignition) {
        this.myCharacter.setVelocityX(300);
      }
    });

    this.texts = { 4: '3', 3: '2', 2: '1', 1: 'GO!', 0: '' };
    this.fills = { 4: 'red', 3: 'red', 2: 'yellow', 1: 'green', 0: '' };
    this.startTime = 5;

    this.addText();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.startTime -= 1;
        this.countdown.setText(`${this.texts[this.startTime]}`);
        this.countdown.setColor(`${this.fills[this.startTime]}`);
        if (this.startTime > 1) {
          this.beep.play();
        } else if (this.startTime === 1) {
          this.go.play();
        }
      },
      callbackScope: this,
      repeat: 4,
    });

    this.time.addEvent({
      delay: 4000,
      callback: () => {
        this.myCharacter.ignition = true;
      },
      callbackScope: this,
      loop: false,
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.cameras.main
          .startFollow(this.myCharacter)
          .setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      },
      callbackScope: this,
      loop: false,
    });

    this.physics.add.overlap(
      this.finishLine,
      this.players,
      this.addToFinishers,
      null,
      this
    );

    this.physics.add.collider(this.players, this.blocker);
  }

  update() {
    if (this.myCharacter) {
      let position = this.myCharacter.x;
      if (
        this.myCharacter.oldPosition &&
        this.myCharacter.oldPosition.x !== position
      ) {
        this.playersRef.child(`${this.myId}`).update({ x: this.myCharacter.x });
      }
      this.myCharacter.oldPositon = {
        x: this.myCharacter.x,
      };
      this.checkGameOver();
    }
  }

  addPlayers(data) {
    data.forEach((player) => {
      if (player.playerId === this.myId) {
        this.spawnMyCharacter(player);
      } else this.spawnOtherCharacter(player);
    });
  }

  spawnOtherCharacter(player) {
    const newPlayer = new RaceCar(
      this,
      this.initX,
      this.initY[player.playerId],
      'car'
    )
      .setScale(2)
      .play(`${player.color}`);
    newPlayer.playerId = player.playerId;
    newPlayer.name = player.name;
    this.allPlayers[player.playerId] = newPlayer;
    this.players.add(newPlayer);
  }

  spawnMyCharacter(player) {
    this.myCharacter = new RaceCar(
      this,
      this.initX,
      this.initY[player.playerId],
      'car'
    )
      .setScale(2)
      .play(`${player.color}`);
    this.myCharacter.playerId = this.myId;
    this.myCharacter.name = player.name;
    this.allPlayers[this.myCharacter.playerId] = this.myCharacter;
    this.players.add(this.myCharacter);
  }

  managePlayers() {
    getRacingGamePlayers(this.gameId, this.spawned, this.addPlayers);

    this.listenerOff = updateRacingGamePlayers(
      this.gameId,
      this.myId,
      this.updateOtherPlayers
    );
  }

  updateOtherPlayers(player) {
    const playerToUpdate = this.allPlayers[player.playerId];

    playerToUpdate.x = player.x;
  }

  addToFinishers(finish, player) {
    if (!this.finishers.includes(player.playerId)) {
      this.finishers.push(player.playerId);
    }
  }

  addText() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.countdown = this.add
      .text(screenCenterX, screenCenterY, '', {
        fontSize: '130px',
        fontFamily: "'lores-12', 'sans-serif'",
        fontStyle: 'bold',
        fill: 'red',
      })
      .setOrigin(0.5);
  }

  createSprites() {
    this.anims.create({
      key: 'red',
      frames: [{ key: 'car', frame: 0 }],
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'green',
      frames: [{ key: 'car', frame: 1 }],
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'orange',
      frames: [{ key: 'car', frame: 2 }],
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'yellow',
      frames: [{ key: 'car', frame: 3 }],
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'blue',
      frames: [{ key: 'car', frame: 4 }],
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'pink',
      frames: [{ key: 'car', frame: 5 }],
      frameRate: 20,
      repeat: -1,
    });
  }

  checkGameOver() {
    if (this.finishers.length === this.players.getChildren().length) {
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.listenerOff();
          this.scene.start('endScreen', {
            playerId: this.myId,
            gameId: this.gameId,
            allPlayers: this.allPlayers,
            finishers: this.finishers,
          });
        },
        callbackScope: this,
        loop: false,
      });
    }
  }
}
