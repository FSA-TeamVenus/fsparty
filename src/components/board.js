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
      pos: 0,
      round: null,
      game: 'platformGame',
      instructions: 'collect coins, arrow keys to move',
    };
    this.stateCb = this.stateCb.bind(this);
    this.randomGameSelection = this.randomGameSelection.bind(this);
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

  stateCb(value, key) {
    this.setState({ [key]: value });
  }

  startGame() {
    updateTurn(gameId);
  }

  rollDice() {
    const { turn, pos, playerList } = this.state;
    const myPlayer = playerList[playerId];
    const number = Phaser.Math.Between(0, 6);
    const button = document.getElementById('dice-roll');
    button.disabled = true;
    const rollDisplay = document.getElementById('roll-display');
    rollDisplay.style.display = 'flex';
    rollDisplay.innerHTML = `You rolled ... `;
    setTimeout(function () {
      rollDisplay.innerHTML = `${number}!`;
    }, 1500);
    setTimeout(function () {
      updatePos(gameId, playerId, number);
      updateTurn(gameId);
      pathDictionary[pos + number].action(gameId, playerId, myPlayer);
    }, 4000);
  }

  // moveGamePiece(tile, player){

  // }

  randomGameSelection() {
    // const games = { 0: 'platformGame', 1: 'racingGame' };
    // const instructions = {
    //   0: 'you have 20 seconds to collect as many coins as possible. move your character with the cursors',
    //   1: "Hit space bar to give 'er some gas",
    // };
    // let index = 0;

    // this.setState({
    //   game: games[index % 2],
    //   instructions: instructions[index % 2],
    // });
    updateTurn(gameId);
    // index += 1;
  }

  render() {
    gameId = Number(window.localStorage.getItem('gameId'));
    playerId = Number(window.localStorage.getItem('idKey'));
    const { turn, playerList, round } = this.state;
    let nextPlayer = playerList[turn];
    return (
      <div>
        {turn < 0 ? <h4 id="game-id">Game Id: {gameId}</h4> : ''}
        {playerList.map((player) => (
          <PlayerCard key={player.playerId} player={player} />
        ))}
        <Leaderboard players={playerList} />
        {turn === playerList.length ? (
          <button className="dice-roll" onClick={this.randomGameSelection}>
            start mini game
          </button>
        ) : (
          <div />
        )}
        {turn === playerList.length + 1 ? (
          <div>
            <GameCanvas
              scene={'shootingGame'}
              instructions={this.state.instructions}
            />
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
            <TileGrid tileList={tileList} playerList={playerList} />
            {playerId !== turn ? (
              <div id="next-player">
                <h4>Round: {round}</h4>
                <h4>Next Player: {nextPlayer ? nextPlayer.name : '...'}</h4>
              </div>
            ) : (
              ''
            )}
          </div>
        )}
        {playerId == turn && playerList ? (
          <div>
            <div id="roll-display" disabled={true}></div>
            <button
              id="dice-roll"
              className="dice-roll"
              onClick={() => this.rollDice()}
            >
              Roll {playerList[playerId].name}!
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default Board;
