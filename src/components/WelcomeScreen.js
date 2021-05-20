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
        <div className="flex-cont-column background-div">
          <Link to="/create">
            <div
              className="div-button box-outline"
              onClick={this.handleNewGame}
            >
              Create Game
            </div>
          </Link>
          <div id="join-div">
            <Link to="/create">
              <div
                className="div-button box-outline"
                onClick={this.handleJoinGame}
              >
                Join Game
              </div>
            </Link>
            <div className="flex-cont-row">
              <div id="code-label">Game Code:</div>
              <input
                type="text"
                id="gameId"
                className="input-form box-outline"
                value={this.state.gameId}
                onChange={this.handleChange}
              ></input>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
