import React from 'react';
import { Link } from 'react-router-dom';
import { getNewPlayerId } from '../Firebase/index';
import { GameTitle } from './GameTitle';

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

  handleChange(evt) {
    this.setState({
      gameId: evt.target.value,
    });
  }

  handleCancel(evt) {
    window.localStorage.removeItem('gameId');
    this.setState({
      gameId: '',
    });
  }

  handleJoinGame() {
    const gameId = this.state.gameId;
    window.localStorage.setItem('gameId', gameId);
    getNewPlayerId(gameId);
  }

  render() {
    return (
      <div>
        <GameTitle />
        <label htmlFor="gameId">
            Enter Game ID: 
        </label>
        <input
          type="text"
          id="gameId"
          value={this.state.gameId}
          onChange={this.handleChange}>
        </input>
        <Link to="/create">
          <button onClick={this.handleJoinGame}>Join Game</button>
        </Link>
        <Link to="/">
          <button onClick={this.handleCancel}>Cancel</button>
        </Link>
      </div>
    );
  }
}
