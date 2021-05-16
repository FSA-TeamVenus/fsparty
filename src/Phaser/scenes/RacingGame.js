import Phaser from 'phaser';
import { racingGamePlayers } from '../../Firebase/index';
import Player from '../entities/Player';

// setting playerId here temporarily until the main game can set it
window.localStorage.setItem('playerId', '1');
const myId = Number(window.localStorage.getItem('playerId'));
// or token

export default class RacingGame extends Phaser.Scene {
  constructor() {
    super('racingGame');

    // using an object to store players instead of a phaser group
    // so we can look up by id instead of iterating through an array
    this.otherPlayers = {};
    this.spawned = false;
  }

  preload() {
    this.load.spritesheet('car', '../../public/assets/images/race_car.png', {
      frameWidth: 32,
      frameHeight: 16,
    });
  }

  create() {
    this.serverPlayers = racingGamePlayers;

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
        const player2update = this.otherPlayers[player.playerId];
        player2update.x = player.x;
      }
    });

    this.createAnimations();

    // setting player movement here instead of update so that the player only moves once on each key press - i.e. they can't just hold down the space bar

    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.spaceBar.on('down', () => {
      this.myCharacter.setVelocityX(100);
    });
  }

  update() {
    if (this.myCharacter) {
      let position = this.myCharacter.x;
      if (
        this.myCharacter.oldPosition &&
        this.myCharacter.oldPosition.x !== position
      ) {
        this.serverPlayers.child(`${myId}`).update({ x: this.myCharacter.x });
      }
      this.myCharacter.oldPositon = {
        x: this.myCharacter.x,
      };
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
    this.otherPlayers[player.playerId] = newPlayer;
  }

  spawnMyCharacter(player) {
    this.myCharacter = new Player(this, player.x, player.y, 'car')
      .setScale(2)
      .play(`${player.color}`);
    this.myCharacter.playerId = myId;
  }

  createAnimations() {
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
