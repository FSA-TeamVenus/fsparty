import React from 'react';
import GameCanvas from './GameCanvas';
import TileGrid from './TileGrid';
import { tileList, pathDictionary } from './tileList';
import PlayerCard from './PlayerCard';
import Phaser from 'phaser';
import {
  getPlayersfromGame,
  getTurn,
  updateTurn,
  updatePos,
  getPos,
  getRound,
  updateMiniGame,
  getMaxRounds,
} from '../Firebase/index';
import Leaderboard from './Leaderboard';
import GameEnd from './GameEnd';
import { Link } from 'react-router-dom';

let gameId = Number(window.localStorage.getItem('gameId'));
let playerId = Number(window.localStorage.getItem('idKey'));

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerList: [],
      turn: null,
      pos: 1,
      round: null,
      maxRounds: 5,
      showModal: true,
      gameOver: false,
      rolled: false,
      gameIndex: 0,
      gamesList: {
        0: 'platformGame',
        1: 'racingGame',
        2: 'shootingGame',
        // 3: 'rockemGame',
      },
      instructions: {
        0: 'use arrows to collect coins',
        1: "Hit space bar to give 'er some gas",
        2: 'Click to shoot as many targets as you can',
        // 3: 'Hit space to punch and get points \nfirst to 100 points win',
      },
    };
    this.stateCb = this.stateCb.bind(this);
    this.selectMiniGame = this.selectMiniGame.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.displayDiceRoll = this.displayDiceRoll.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  componentDidMount() {
    this.playersOff = getPlayersfromGame(gameId, this.stateCb);
    this.turnOff = getTurn(gameId, this.stateCb);
    this.posOff = getPos(gameId, playerId, this.stateCb);
    this.roundOff = getRound(gameId, this.stateCb);
    getMaxRounds(gameId, this.stateCb);
    const music = document.getElementById('music');
    music.play();
    music.volume = 0.75;
    music.loop = true;
  }

  componentWillUnmount() {
    this.playersOff();
    this.turnOff();
    this.posOff();
    this.roundOff();
  }

  rollDice() {
    const { pos, playerList } = this.state;
    const myPlayer = playerList[playerId];
    const diceRoll = Phaser.Math.Between(1, 6);
    const diceAudio = document.getElementById('dice');
    diceAudio.play();
    diceAudio.play();
    this.displayDiceRoll(diceRoll);
    this.setState({
      rolled: true,
    });

    setTimeout(() => this.movePlayer(pos, diceRoll, myPlayer), 2000);

    setTimeout(
      () =>
        this.setState({
          rolled: false,
        }),
      5000
    );
  }

  displayDiceRoll(diceRoll) {
    const rollDisplay = document.getElementById('roll-display');
    rollDisplay.innerHTML = '...';
    setTimeout(function () {
      rollDisplay.innerHTML = `${diceRoll}!`;
    }, 1000);
  }

  movePlayer(pos, diceRoll, myPlayer) {
    const audio = document.getElementById('wah');
    audio.play();
    updatePos(gameId, playerId, diceRoll);
    updateTurn(gameId);
    pathDictionary[pos + diceRoll].action(gameId, playerId, myPlayer);
  }

  stateCb(value, key) {
    this.setState({ [key]: value });
  }

  startGame() {
    const audio = document.getElementById('start-sound');
    audio.play();
    updateTurn(gameId);
  }

  selectMiniGame() {
    const audio = document.getElementById('start-sound');
    audio.play();
    const { gameIndex, gamesList, instructions } = this.state;
    const listLength = Object.keys(gamesList).length;

    const scene = gamesList[gameIndex % listLength];
    const gameInstructions = instructions[gameIndex % listLength];

    updateMiniGame(gameId, scene, gameInstructions);

    this.setState({
      gameIndex: gameIndex + 1,
    });
    updateTurn(gameId);
  }

  closeModal() {
    const audio = document.getElementById('ok-sound');
    audio.play();
    this.setState({
      showModal: false,
    });
  }

  endGame() {
    const music = document.getElementById('music');
    music.pause();
    this.setState({
      gameOver: true,
    });
  }

  render() {
    gameId = Number(window.localStorage.getItem('gameId'));
    playerId = Number(window.localStorage.getItem('idKey'));
    const { turn, playerList, round } = this.state;
    const currentPlayer = playerList[turn] || { name: '' };
    return (
      <div>
        <audio id="start-sound" src="assets/audio/beep2.wav" />
        <audio id="ok-sound" src="assets/audio/beep.wav" />
        <audio id="dice" src="assets/audio/dice_roll.mp3"></audio>
        <audio id="wah" src="assets/audio/wah.wav"></audio>
        <audio id="music" src="assets/audio/bootleg-party-theme.wav" />
        <div id="central-div">
          {turn >= 0 && turn < playerList.length ? (
            <div id="current-turn">
              <p className={`${currentPlayer.color}-text`}>Current Turn:</p>
              <img src={currentPlayer.spriteUrl} alt="" />
              <p className={`${currentPlayer.color}-text`}>
                {currentPlayer.name}
              </p>
            </div>
          ) : (
            <div />
          )}
          <Leaderboard
            players={playerList}
            round={round}
            startMiniGame={this.selectMiniGame}
            turn={turn}
            playerId={playerId}
          />
          <div className="current-round">
            <div>ROUND</div>
            <div>{round}</div>
          </div>
        </div>
        {turn === playerList.length + 1 ? (
          <div>
            <GameCanvas gameId={gameId} />
          </div>
        ) : (
          <div />
        )}
        {turn < 0 && round == 1 ? (
          <div className="start-info flex-cont-column">
            <div>
              <img
                className="invader"
                src="assets/board/images/invader-red.png"
              />
              <img
                className="invader"
                src="assets/board/images/invader-green.png"
              />
              <img
                className="invader"
                src="assets/board/images/invader-yellow.png"
              />
              <img
                className="invader"
                src="assets/board/images/invader-pink.png"
              />
              <img
                className="invader"
                src="assets/board/images/invader-blue.png"
              />
              <img
                className="invader"
                src="assets/board/images/invader-orange.png"
              />
            </div>
            <div id="story">
              Help! Attracted by satellite broadcasts of Earth media, a
              nefarious group of aliens has landed on earth and stolen all
              original videogames, leaving behind nothing but poorly made
              bootleg versions and a challenge: beat the high score in their
              Mario Party clone to get back the original versions of our
              favorite games.
            </div>
            {playerId == 0 ? (
              <div>
                <button
                  id="start"
                  className="board-button"
                  onClick={this.startGame}
                >
                  Start Game
                </button>
              </div>
            ) : (
              <div />
            )}
          </div>
        ) : (
          <div>
            <TileGrid
              tileList={tileList}
              playerList={playerList}
              dictionary={pathDictionary}
            />
          </div>
        )}
        {playerId == turn && playerList ? (
          <div className="popup-container flex-cont-column">
            <div
              className={`${currentPlayer.color}-text`}
              id="roll-display"
            ></div>
            {!this.state.rolled ? (
              <button className="dice-roll" onClick={this.rollDice}>
                Roll Dice!
              </button>
            ) : (
              <div />
            )}
          </div>
        ) : (
          <div />
        )}
        {round === this.state.maxRounds && this.state.showModal ? (
          <div className="popup-container flex-cont-column modal" id="popup">
            <div className="popup-style">FINAL ROUND!</div>
            <div className="div-button" id="ok" onClick={this.closeModal}>
              OK
            </div>
          </div>
        ) : (
          <div />
        )}
        {round === this.state.maxRounds + 1 ? (
          <div className=" popup-container flex-cont-column">
            <div className="popup-style">Game Over</div>
            <div id="view-result-button" onClick={this.endGame}>
              View Results
            </div>
          </div>
        ) : (
          <div />
        )}
        {this.state.gameOver ? (
          <GameEnd players={playerList} playerId={playerId} gameId={gameId} />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Board;
