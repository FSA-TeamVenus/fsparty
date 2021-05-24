import React from 'react';
import { addPlayerToGame } from '../Firebase/index';
import { Link } from 'react-router-dom';

export default class CreatePlayer extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      round: 0,
      color: 'red',
      round: 0,
      colorIndex: 0,
      spriteUrl: 'assets/board/images/mushroom-red.png',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleColorSelect = this.handleColorSelect.bind(this);
    this.playAudio = this.playAudio.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  handleJoin() {
    this.playAudio();
    const playerId = Number(window.localStorage.getItem('idKey'));
    const gameId = window.localStorage.getItem('gameId');
    const { name, color, spriteUrl } = this.state;
    const playerObj = { name, color, spriteUrl };
    addPlayerToGame(gameId, playerId, playerObj);
  }

  handleColorSelect(evt) {
    const colorArray = ['red', 'yellow', 'green', 'pink', 'orange', 'blue'];
    const { colorIndex } = this.state;
    const value = evt.target.value === 'next' ? 1 : -1;

    const newIndex = colorIndex + value;
    const newColor = colorArray[newIndex % colorArray.length];
    const newUrl = `assets/board/images/mushroom-${newColor}.png`;

    this.setState({
      color: newColor,
      colorIndex: newIndex,
      spriteUrl: newUrl,
    });
  }

  playAudio() {
    const audio = document.getElementById('beep');
    audio.play();
  }

  render() {
    const gameId = window.localStorage.getItem('gameId');
    return (
      <div className="flex-cont-column background-div">
        <audio id="beep" src="assets/audio/beep2.wav" />
        <div className="flex-cont-column">
          <div className="flex-cont-row">
            <div className="flex-cont-column">
              <label htmlFor="color">Pick Your Color</label>
              <div id="image-div" className="flex-cont-column box-outline">
                <img src={this.state.spriteUrl} alt="mushroom" />
              </div>
              <div className="flex-cont-row">
                <input
                  type="button"
                  className="input-form color-button box-outline"
                  onClick={this.handleColorSelect}
                  value={'previous'}
                ></input>
                <input
                  type="button"
                  className="input-form color-button box-outline"
                  onClick={this.handleColorSelect}
                  value={'next'}
                ></input>
              </div>
            </div>
            <div className="flex-cont-column">
              <div className="input-form">Game Code: {gameId}</div>
              <label htmlFor="name">Enter Your Name</label>
              <input
                type="text"
                name="name"
                className="input-form box-outline"
                value={this.state.name}
                onChange={this.handleChange}
              ></input>
              <div className="div-button image-div box-outline">
                <Link to="/board">
                  <div onClick={this.handleJoin}>Join Game</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
