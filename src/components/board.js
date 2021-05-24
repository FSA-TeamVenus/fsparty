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
  updateRound,
  updateMiniGame,
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
      gamesList: { 0: 'platformGame', 1: 'racingGame', 2: 'shootingGame'},
      instructions: {
        0: 'use arrows to collect coins',
        1: "Hit space bar to give 'er some gas",
        2: 'Click to shoot as many targets as you can'
      },
    };
    this.stateCb = this.stateCb.bind(this);
    this.selectMiniGame = this.selectMiniGame.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.playersOff = getPlayersfromGame(gameId, this.stateCb);
    this.turnOff = getTurn(gameId, this.stateCb);
    this.posOff = getPos(gameId, playerId, this.stateCb);
    this.roundOff = getRound(gameId, this.stateCb);
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
    const diceRoll = Phaser.Math.Between(0, 6);
    const rollDisplay = document.getElementById('roll-display');

    rollDisplay.innerHTML = '...';
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

    const scene = gamesList[gameIndex % 3];
    const gameInstructions = instructions[gameIndex % 3];

    updateMiniGame(gameId, scene, gameInstructions);


    this.setState({
      gameIndex: gameIndex + 1,
    });
    updateTurn(gameId);
  }

  closeModal() {
    this.setState({
      showModal: false,
    });
  }

  render() {
    gameId = Number(window.localStorage.getItem('gameId'));
    playerId = Number(window.localStorage.getItem('idKey'));
    console.log(this.state.gameIndex)
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
            id='start'
            className='board-button'
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
          <button className='board-button' onClick={this.selectMiniGame}>
            start mini game
          </button>
        ) : (
          <div />
        )}
        {playerId == turn && playerList ? (
          <div className='popup-container flex-cont-column'>
            <div
              className={`${currentPlayer.color}-text`}
              id='roll-display'
            ></div>
            <button className='dice-roll' onClick={() => this.rollDice()}>
              Roll Dice!
            </button>
          </div>
        ) : (
          <div />
        )}
        {turn >= 0 && turn < playerList.length ? (
          <div id='current-turn'>
            <p
              className={`${currentPlayer.color}-text`}
            >{`${currentPlayer.name}'s turn!`}</p>
            <img src={currentPlayer.spriteUrl} alt='' />
          </div>
        ) : (
          <div />
        )}
        {round === 3 && this.state.showModal ? (
          <div className='popup-container flex-cont-column modal' id='popup'>
            <div className='popup-style'>FINAL ROUND!</div>
            <div className='div-button' id='ok' onClick={this.closeModal}>
              OK
            </div>
          </div>
        ) : (
          <div />
        )}
        {round === 4 ? (
          <div className=' popup-container flex-cont-column'>
            <div className='popup-style'>Game Over</div>
            <Link
              to={{
                pathname: "/end",
                state: {
                  players: playerList,
                  gameId: gameId,
                  playerId: playerId,
                },
              }}
            >
              <div id='view-result-button'>View Results</div>
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
