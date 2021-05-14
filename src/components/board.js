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

const gameId = 1;

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
    getPos(gameId, this.props.player.id, this.stateCb);
    getRound(gameId, this.stateCb);
  }
  componentWillUnmount() {
    this.rmPlayersListener();
  }

  stateCb(value, key) {
    this.setState({ [key]: value });
  }

  startGame() {
    updateTurn(gameId, this.stateCb);
  }

  rollDice() {
    const { turn, pos, playerList } = this.state;
    const { player } = this.props;
    const myPlayer = playerList[player.id];
    const number = Phaser.Math.Between(0, 6);
    updatePos(gameId, player.id, number);
    pathDictionary[pos + number].action(gameId, player.id, myPlayer);
    updateTurn(gameId, this.stateCb);
  }

  // moveGamePiece(tile, player){

  // }

  render() {
    const { player } = this.props;
    const { turn, playerList, round } = this.state;
    const nextPlayer = playerList[turn];
    console.log(playerList);
    return (
      <div>
        {/* <h3 id="welcome">Welcome, {user.name}</h3> */}
        {playerList.map((player) => (
          <PlayerCard key={player.name} player={player} />
        ))}
        <Leaderboard players={playerList} />
        {turn < 0 ? (
          <button onClick={() => this.startGame()}>Start Game</button>
        ) : (
          <TileGrid tileList={tileList} playerList={playerList} />
        )}
        {player.id == turn && playerList ? (
          <button id="dice-roll" onClick={() => this.rollDice()}>
            Roll {player.name}
          </button>
        ) : (
          ''
          // <div>
          //   Round: {round}. Next Player: {nextPlayer ? nextPlayer.name : '...'}
          // </div>
        )}
        {turn === playerList.length ? <GameCanvas /> : <div />}
      </div>
    );
  }
}

export default Board;
