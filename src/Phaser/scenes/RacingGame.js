import Phaser from 'phaser';
import {
  racingGamePlayers,
  getRacingGamePlayers,
  updateRacingGamePlayers,
  finishRacingGame,
} from '../../Firebase/index';
import Player from '../entities/Player';

// setting playerId here temporarily until the main game can set it
window.localStorage.setItem('playerId', '1');
const myId = Number(window.localStorage.getItem('playerId'));
// or token

export default class RacingGame extends Phaser.Scene {
  constructor() {
    super('racingGame');

    this.allPlayers = {};
    this.spawned = false;
    this.gameId = 1;
    this.finishers = [];

    this.addPlayers = this.addPlayers.bind(this);
    this.spawnMyCharacter = this.spawnMyCharacter.bind(this);
    this.spawnOtherCharacters = this.spawnOtherCharacters.bind(this);
    this.managePlayers = this.managePlayers.bind(this);
    this.updateOtherPlayers = this.updateOtherPlayers.bind(this);
  }

  preload() {
    this.load.spritesheet('car', '/assets/images/race_car.png', {
      frameWidth: 32,
      frameHeight: 16,
    });
    this.load.image('finish_line', '/assets/images/finish_line.png');
    this.load.image('track', '/assets/images/track.png');
    this.load.image('bg', '/assets/images/racing_bg.png');
  }

  create() {
    this.managePlayers();

    this.createSprites();

    // this.background = this.add.image(400, 300, 'bg');
    // this.track = this.add.image(400, 450, 'track');
    // this.track2 = this.add.image(400, 150, 'track');
    this.players = this.add.group();

    this.finishLine = this.physics.add.image(750, 400, 'finish_line');

    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.spaceBar.on('down', () => {
      this.myCharacter.setVelocityX(100);
    });

    this.physics.add.overlap(
      this.finishLine,
      this.players,
      this.addToFinishers,
      null,
      this
    );
  }

  update() {
    if (this.myCharacter) {
      let position = this.myCharacter.x;
      if (
        this.myCharacter.oldPosition &&
        this.myCharacter.oldPosition.x !== position
      ) {
        racingGamePlayers.child(`${myId}`).update({ x: this.myCharacter.x });
      }
      this.myCharacter.oldPositon = {
        x: this.myCharacter.x,
      };
      if (this.finishers.length === this.players.getChildren().length) {
        finishRacingGame(this.gameId);
        this.scene.start('endScreen', {
          gameId: this.gameId,
          allPlayers: this.allPlayers,
          finishers: this.finishers,
        });
      }
    }
  }

  addPlayers(data) {
    data.forEach((player) => {
      if (player.playerId === myId) {
        this.spawnMyCharacter(player);
      } else this.spawnOtherCharacters(player);
    });
  }

  spawnOtherCharacters(player) {
    const newPlayer = new Player(this, player.x, player.y, 'car')
      .setScale(2)
      .play(`${player.color}`);
    newPlayer.playerId = player.playerId;
    newPlayer.name = player.name;
    this.allPlayers[player.playerId] = newPlayer;
    this.players.add(newPlayer);
  }

  spawnMyCharacter(player) {
    this.myCharacter = new Player(this, player.x, player.y, 'car')
      .setScale(2)
      .play(`${player.color}`);
    this.myCharacter.playerId = myId;
    this.myCharacter.name = player.name;
    this.allPlayers[this.myCharacter.playerId] = this.myCharacter;
    this.players.add(this.myCharacter);
  }

  managePlayers() {
    getRacingGamePlayers(this.gameId, this.spawned, this.addPlayers);

    updateRacingGamePlayers(this.gameId, myId, this.updateOtherPlayers);
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

  createSprites() {
    this.anims.create({
      key: 'red',
      frames: [{ key: 'car', frame: 0 }],
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'pink',
      frames: [{ key: 'car', frame: 1 }],
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'blue',
      frames: [{ key: 'car', frame: 2 }],
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'green',
      frames: [{ key: 'car', frame: 3 }],
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'orange',
      frames: [{ key: 'car', frame: 4 }],
      frameRate: 20,
      repeat: -1,
    });
  }
}
