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

    this.addText();

    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.header.setText('INSTRUCTIONS');
        this.instructionText.setText(`${this.instructions}`);
      },
      callbackScope: this,
      loop: false,
    });

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
      delay: 10500,
      callback: () => {
        this.scene.start(`${this.nextScene}`);
      },
      callbackScope: this,
      loop: false,
    });
  }

  addText() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.header = this.add
      .text(screenCenterX, 150, '', {
        fontSize: '30px',
        fontFamily: "'lores-12', 'sans-serif'",
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.instructionText = this.add
      .text(screenCenterX, 250, ``, {
        fontSize: '20px',
        fontFamily: "'lores-12', 'sans-serif'",
      })
      .setOrigin(0.5);

    this.timer = this.add
      .text(screenCenterX, 350, ``, {
        fontSize: '20px',
        fontFamily: "'lores-12', 'sans-serif'",
      })
      .setOrigin(0.5);
  }
}
