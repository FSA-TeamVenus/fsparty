import React from 'react';
import { Link } from 'react-router-dom';
import { createNewGame, getNewPlayerId } from '../Firebase/index';
import { GameTitle } from './GameTitle';
import btnClickAudio from '../../docs/assets/sounds/btn-click.mp3';

export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      gameId: '',
    };
    this.handleNewGame = this.handleNewGame.bind(this);
  }

  handleBtnClick() {
    const sound = new Audio(btnClickAudio);
    sound.play();
  }
  
  handleNewGame() {
    this.handleBtnClick();
    createNewGame();
    window.localStorage.setItem('idKey', '0');
  }

  render() {
    return (
      <div className="input-div">
        <GameTitle />
        <div className="center-box">
          <Link to="/create">
            {/* <button onClick={this.handleNewGame}>Create Game</button> */}
            <img onClick={this.handleNewGame} className="create-gm-btn" src="../../assets/images/create-game-btn.png" />
          </Link>
          <Link to="/join">
            {/* <button className="center-btn">Join Game</button> */}
            <img onClick={this.handleBtnClick} className="join-gm-btn" src="../../assets/images/join-game-btn.png" />

          </Link>
        </div>
      </div>
    );
  }
}
