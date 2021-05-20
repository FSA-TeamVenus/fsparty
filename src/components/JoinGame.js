import React from 'react';
import { Link } from 'react-router-dom';
import { getNewPlayerId } from '../Firebase/index';
import { GameTitle } from './GameTitle';
import btnClickAudio from '../../docs/assets/sounds/btn-click.mp3';

export default class JoinGame extends React.Component {
  constructor() {
    super();
    this.state = {
      gameId: '',
    };
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleBtnClick() {
    const sound = new Audio(btnClickAudio);
    sound.play();
  }

  handleChange(evt) {
    this.setState({
      gameId: evt.target.value,
    });
  }

  handleCancel(evt) {
    this.handleBtnClick();
    window.localStorage.removeItem('gameId');
    this.setState({
      gameId: '',
    });
  }

  handleJoinGame() {
    this.handleBtnClick();
    const gameId = this.state.gameId;
    window.localStorage.setItem('gameId', gameId);
    getNewPlayerId(gameId);
  }

  render() {
    return (
      <div className="input-div">
        <GameTitle />
        <h1>Enter Game ID:</h1> 
        <input 
          type="text"
          id="gameId"
          value={this.state.gameId}
          onChange={this.handleChange}>
        </input>
        <Link to="/create">
          {/* <button onClick={this.handleJoinGame}>Join Game</button> */}
          <img onClick={this.handleJoinGame} className="join-gm-btn" src="../../assets/images/join-game-btn.png" />
        </Link>
        <Link to="/">
          {/* <button onClick={this.handleCancel}>Cancel</button> */}
          <img onClick={this.handleBtnClick} className="join-gm-btn" src="../../assets/images/cancel-btn.png" />
        </Link>
      </div>
    );
  }
}
