import React from 'react';
import { Link } from 'react-router-dom';
import { createNewGame, getNewPlayerId } from '../Firebase/index';

export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      gameId: '',
    };

    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleNewGame() {
    createNewGame();
    window.localStorage.setItem('idKey', '0');
  }

  handleChange(evt) {
    this.setState({
      gameId: evt.target.value,
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
        <Link to='/create'>
          <button onClick={this.handleNewGame}>Create Game</button>
        </Link>
        <input
          type='text'
          id='gameId'
          value={this.state.gameId}
          onChange={this.handleChange}
        ></input>
        <Link to='/join'>
          <button onClick={this.handleJoinGame}>Join Game</button>
        </Link>
      </div>
    );
  }
}
