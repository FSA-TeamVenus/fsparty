import React from 'react';
import { Game } from '../Phaser/index';
import config from '../Phaser/config/config';

export default class GameCanvas extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    new Game(config);
  }

  // componentWillUnmount() {
  //   this.sys.game.destroy(true);
  // }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id='game-canvas'></div>;
  }
}
