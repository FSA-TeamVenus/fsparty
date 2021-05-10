import React from 'react';
import { Game } from '../Phaser/index';
import config from '../Phaser/config/config';

export default class GameCanvas extends React.Component {
  constructor() {
    super();
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.canvasRef.current);
    new Game({...config, canvas: this.canvasRef.current, parent: null });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate() {
    console.log(this.canvasRef.current);
  }

  render() {
    return <canvas ref={this.canvasRef} id="game-canvas"></canvas>;
  }
}
