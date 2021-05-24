import Phaser from 'phaser';

export default class StartScreen extends Phaser.Scene {
  constructor() {
    super('startScreen');
  }

  init(data) {
    this.nextScene = data.nextScene;
    this.instructions = data.instructions;
  }

  create() {
    this.seconds = 10;
    this.add.text(250, 150, 'INSTRUCTIONS', {
      fontSize: '30px',
      fontFamily: "'lores-12', 'sans-serif'",
      fontStyle: 'bold',
    });
    this.add.text(250, 250, `${this.instructions}`, {
      fontSize: '20px',
      fontFamily: "'lores-12', 'sans-serif'",
    });

    this.timer = this.add.text(
      250,
      300,
      `Game Starting in ${this.seconds} seconds`
    );

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.seconds -= 1;
        this.timer.setText(`Game Starting in ${this.seconds} seconds`);
      },
      callbackScope: this,
      loop: 10,
    });

    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.scene.start(`shootingGame`);
      },
      callbackScope: this,
      loop: false,
    });
  }
}
