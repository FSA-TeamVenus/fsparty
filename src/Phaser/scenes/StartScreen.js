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
    this.add.text(300, 150, 'INSTRUCTIONS', {
      fontSize: '30px',
      fontFamily: "'lores-12', 'sans-serif'",
      fontStyle: 'bold',
    });
    this.add.text(300, 250, `${this.instructions}`, {
      fontSize: '20px',
      fontFamily: "'lores-12', 'sans-serif'",
    });

    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.scene.start(`${this.nextScene}`);
      },
      callbackScope: this,
      loop: false,
    });
  }
}
