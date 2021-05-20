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
} from '../Firebase/index';
import Leaderboard from './Leaderboard';

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
  }

  componentDidMount() {
    this.rmPlayersListener = getPlayersfromGame(gameId, this.stateCb);
    getTurn(gameId, this.stateCb);
    getPos(gameId, playerId, this.stateCb);
    getRound(gameId, this.stateCb);
  }
  componentWillUnmount() {
    this.rmPlayersListener();
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
  // moveGamePiece(tile, player){

  // }

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
          <button id="start" onClick={() => this.startGame()}>
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
          <button className="dice-roll" onClick={this.selectMiniGame}>
            start mini game
          </button>
        ) : (
          <div />
        )}
        {playerId == turn && playerList ? (
          <div>
            <button
              // id="dice-roll"
              className="dice-roll"
              onClick={() => this.rollDice()}
            >
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
      </div>
    );
  }
}

export default Board;
