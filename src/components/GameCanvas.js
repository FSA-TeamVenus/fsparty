import React from 'react';
import { Game } from '../Phaser/index';
import platformConfig from '../Phaser/config/platformConfig';

export default class GameCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const scene = this.props.scene;
    const instructions = this.props.instructions;
    new Game(platformConfig, 'shootingGame', instructions);
  }

  // componentWillUnmount() {
  //   this.sys.game.destroy(true);
  // }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id="game-canvas"></div>;
  }
}
