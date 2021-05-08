import Phaser from 'phaser';
import { players } from '../../Firebase/index';
import Player from '../entities/Player';

// const myId = 1;
window.localStorage.setItem('playerId', '1');
const myId = Number(window.localStorage.getItem('playerId'));
// or token

export default class RacingGame extends Phaser.Scene {
  constructor() {
    super('racingGame');

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
    this.serverPlayers = players;

    this.serverPlayers.on('value', (snapshot) => {
      const list = snapshot.val();
      if (!this.spawned) {
        this.addPlayers(list);
        this.spawned = true;
      }
    });

    this.serverPlayers.on('child_changed', (snapshot) => {
      const player = snapshot.val();
      if (player.id !== myId) {
        const player2update = this.otherPlayers[player.id];
        player2update.x = player.x;
      }
    });

    this.createAnimations();

    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.spaceBar.on('down', () => {
      this.myCharacter.setVelocityX(100);
    });

    // this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.myCharacter) {
      // this.myCharacter.update(this.cursors);
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
      if (player.id === myId) {
        this.spawnMyCharacter(player);
      } else this.spawnOtherCharacters(player);
    });
  }

  spawnOtherCharacters(player) {
    const newPlayer = new Player(this, player.x, player.y, 'car')
      .setScale(2)
      .play(`${player.color}`);
    newPlayer.playerId = player.id;
    this.otherPlayers[player.id] = newPlayer;
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
