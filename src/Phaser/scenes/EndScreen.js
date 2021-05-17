import Phaser from 'phaser';
import { addPoints, updateRound } from '../../Firebase/index';

export default class EndScreen extends Phaser.Scene {
  constructor() {
    super('endScreen');
  }

  init(data) {
    this.gameId = data.gameId;
    this.allPlayers = data.allPlayers;
    this.finishersList = data.finishers;
  }

  create() {
    this.add.text(300, 150, 'RESULTS');
    let yPosition = 200;
    for (let i = 0; i < this.finishersList.length; i++) {
      const currentId = this.finishersList[i];
      const currentPlayer = this.allPlayers[currentId];
      const place = i + 1;
      const earnedPoints = this.calculatePoints(place);

      this.add.text(
        300,
        yPosition,
        `${place}: ${currentPlayer.name} ------- +${earnedPoints} points`
      );
      yPosition += 50;
      addPoints(this.gameId, currentId, earnedPoints);
    }

    this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.scene.stop();
        updateRound(this.gameId);
        this.sys.game.destroy(true);
      },
      callbackScope: this,
      loop: false,
    });
  }

  calculatePoints(place) {
    switch (place) {
      case 1:
        return 10;
      case 2:
        return 5;
      case 3:
        return 1;
      default:
        return 0;
    }
  }
}
