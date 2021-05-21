import React from 'react';
import { Game } from '../Phaser/index';
import platformConfig from '../Phaser/config/platformConfig';
import { getMiniGameData } from '../Firebase/index';

export default class GameCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const gameId = this.props.gameId;

    function startGame(gameScene, gameInstructions) {
      const scene = gameScene;
      const instructions = gameInstructions;
      new Game(platformConfig, scene, instructions);
    }
    getMiniGameData(gameId, startGame);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id="game-canvas"></div>;
  }
}
