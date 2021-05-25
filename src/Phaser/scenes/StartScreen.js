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
    this.add.text(300, 250, `use arrows to move and collect coins`);
    this.add.text(300, 300, `hit ENTER to start`);

    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.enter.on('down', () => {
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.scene.start('platformGame');
        },
        callbackScope: this,
        loop: false,
      });
    });
  }
}
