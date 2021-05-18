import React from 'react';
import { Link } from 'react-router-dom';
import { createNewGame, getNewPlayerId } from '../Firebase/index';
import { GameTitle } from './GameTitle';

export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      gameId: '',
    };

    this.handleNewGame = this.handleNewGame.bind(this);

  }

  handleNewGame() {
    createNewGame();
    window.localStorage.setItem('idKey', '0');
  }

  render() {
    return (
      <div>
        <GameTitle />
        <Link to="/create">
          <button onClick={this.handleNewGame}>Create Game</button>
        </Link>
        <Link to="/join">
          <button>Join Game</button>
        </Link>
      </div>
    );
  }
}
