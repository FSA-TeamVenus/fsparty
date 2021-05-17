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
    };
    this.stateCb = this.stateCb.bind(this);
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
    updatePos(gameId, playerId, number);
    pathDictionary[pos + number].action(gameId, playerId, myPlayer);
    updateTurn(gameId);
  }

  // moveGamePiece(tile, player){

  // }

  render() {
    gameId = Number(window.localStorage.getItem('gameId'));
    playerId = Number(window.localStorage.getItem('idKey'));

    const { turn, playerList, round } = this.state;
    gameId = Number(window.localStorage.getItem('gameId'));
    playerId = Number(window.localStorage.getItem('idKey'));

    return (
      <div>
        {playerList.map((player) => (
          <PlayerCard key={player.playerId} player={player} />
        ))}
        <Leaderboard players={playerList} />
        {turn < 0 ? (
          <button onClick={() => this.startGame()}>Start Game</button>
        ) : (
          <TileGrid tileList={tileList} playerList={playerList} />
        )}
        {playerId == turn && playerList ? (
          <button id="dice-roll" onClick={() => this.rollDice()}>
            Roll
            {/* {playerList[playerId].name} */}
          </button>
        ) : (
          ''
          // <div>
          //   Round: {round}. Next Player: {nextPlayer ? nextPlayer.name : '...'}
          // </div>
        )}
        {turn === playerList.length ? (<div><GameCanvas /> <button onClick={()=> updateRound(gameId)}>Click me to end the round!</button></div>
        ): <div />}
      </div>
    );
  }
}

export default Board;
