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
    this.add.text(300, 150, 'Instructions');
    this.add.text(300, 250, `${this.instructions}`);

    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.start(`shootingGame`);
      },
      callbackScope: this,
      loop: false,
    });
  }
}
