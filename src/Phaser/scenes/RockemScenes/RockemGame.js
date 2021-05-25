import 'phaser'

export default class RockemGame extends Phaser.Scene {
  constructor() {
    super('rockemGame');
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('BgScene');
    this.scene.launch('FgScene')
  }
}
