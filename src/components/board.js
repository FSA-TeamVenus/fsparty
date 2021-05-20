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
  nukeListeners,
} from '../Firebase/index';
import Leaderboard from './Leaderboard';
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
      showModal: true,
      gameIndex: 0,
      gamesList: { 0: 'platformGame', 1: 'racingGame' },
      instructions: {
        0: 'you have 20 seconds \nto collect as many coins as possible. \nmove your character with the cursors',
        1: "Hit space bar to give 'er some gas",
      },
    };
    this.stateCb = this.stateCb.bind(this);
    this.selectMiniGame = this.selectMiniGame.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    getPlayersfromGame(gameId, this.stateCb);
    getTurn(gameId, this.stateCb);
    getPos(gameId, playerId, this.stateCb);
    getRound(gameId, this.stateCb);
  }

  componentWillUnmount() {
    nukeListeners(gameId, playerId);
  }

  rollDice() {
    const { pos, playerList } = this.state;
    const myPlayer = playerList[playerId];
    const diceRoll = Phaser.Math.Between(0, 6);
    const rollDisplay = document.getElementById('roll-display');
    rollDisplay.innerHTML = 'rolling...';
    setTimeout(function () {
      rollDisplay.innerHTML = `${diceRoll}!`;
    }, 1500);
    this.stateCb(pos + diceRoll, 'pos');
    setTimeout(function () {
      updatePos(gameId, playerId, diceRoll);
      updateTurn(gameId);
      pathDictionary[pos + diceRoll].action(gameId, playerId, myPlayer);
    }, 4000);
  }

  stateCb(value, key) {
    this.setState({ [key]: value });
  }

  startGame() {
    updateTurn(gameId);
  }

  selectMiniGame() {
    const { gameIndex, gamesList, instructions } = this.state;

    const scene = gamesList[gameIndex % 2];
    const gameInstructions = instructions[gameIndex % 2];

    updateMiniGame(gameId, scene, gameInstructions);
    updateTurn(gameId);

    this.setState({
      gameIndex: this.state.gameIndex + 1,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
    });
  }

  render() {
    gameId = Number(window.localStorage.getItem('gameId'));
    playerId = Number(window.localStorage.getItem('idKey'));
    const { turn, playerList, round } = this.state;
    const currentPlayer = playerList[turn] || { name: '' };
    return (
      <div>
        {playerList.map((player) => (
          <PlayerCard key={player.playerId} player={player} />
        ))}
        <Leaderboard players={playerList} round={round} />
        {turn === playerList.length + 1 ? (
          <div>
            <GameCanvas gameId={gameId} />
          </div>
        ) : (
          <div />
        )}
        {turn < 0 && round == 1 && playerId == 0 ? (
          <button
            id="start"
            className="board-button"
            onClick={() => this.startGame()}
          >
            Start Game
          </button>
        ) : (
          <div>
            <TileGrid
              tileList={tileList}
              playerList={playerList}
              dictionary={pathDictionary}
            />
          </div>
        )}
        {turn === playerList.length && playerId === 0 ? (
          <button className="board-button" onClick={this.selectMiniGame}>
            start mini game
          </button>
        ) : (
          <div />
        )}
        {playerId == turn && playerList ? (
          <div className="popup-container flex-cont-column">
            <div className="image-container">image</div>
            <button className="dice-roll" onClick={() => this.rollDice()}>
              Roll Dice!
            </button>
          </div>
        ) : (
          <div />
        )}
        {turn < playerList.length ? (
          <div id="current-turn">
            <p
              className={`${currentPlayer.color}-text`}
            >{`${currentPlayer.name}'s turn!`}</p>
            <img src={currentPlayer.spriteUrl} alt="" />
          </div>
        ) : (
          <div />
        )}
        {turn < playerList.length ? (
          <div
            className={`${currentPlayer.color}-text`}
            id="roll-display"
          ></div>
        ) : (
          <div />
        )}
        {round === 2 && this.state.showModal ? (
          <div className="popup-container flex-cont-column modal" id="popup">
            FINAL ROUND!
            <div className="div-button" onClick={this.closeModal}>
              OK
            </div>
          </div>
        ) : (
          <div />
        )}
        {round === 3 ? (
          <div className=" popup-container flex-cont-column">
            <div>Game Over</div>
            <Link
              to={{
                pathname: '/end',
                state: {
                  players: playerList,
                  gameId: gameId,
                  playerId: playerId,
                },
              }}
            >
              View Results
            </Link>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Board;
