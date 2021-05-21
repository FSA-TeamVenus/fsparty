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
    this.rotateCube = this.rotateCube.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.rotateCube);
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.rotateCube);
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

  rotateCube(event) {
    const cube = document.getElementById('box');
    const x = event.pageX;
    const y = event.pageY;

    cube.style.transform = `rotateY(${x * 0.2}deg) rotateX(${y * 0.2}deg)`;
  }

  render() {
    return (
      <div className="background-div flex-cont-row">
        <div id="box-container">
          <section id="box">
            <div className="face one"></div>
            <div className="face two"></div>
            <div className="face three"></div>
            <div className="face four"></div>
            <div className="face five"></div>
            <div className="face six"></div>
          </section>
        </div>
        <div id="welcome-div">
          <div id="create-wrapper">
            <Link to="/settings">
              <div
                className="div-button box-outline"
                onClick={this.handleNewGame}
              >
                Create Game
              </div>
            </Link>
            <div id="join-div">
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
              <Link to="/create">
                <div
                  className="div-button box-outline"
                  onClick={this.handleJoinGame}
                >
                  Join Game
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
