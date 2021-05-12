import React from 'react';
import GameCanvas from './GameCanvas';
import TileGrid from './TileGrid';
import tileList from './tileList';
import PlayerCard from './PlayerCard';

import {
  getPlayersfromGame,
  getTurn,
  updateTurn,
  updatePos,
  getPos,
  getRound,
  updateRound,
} from '../Firebase/index';

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerList: [],
      turn: null,
      pos: null,
      round: null,
    };
    this.stateCb = this.stateCb.bind(this);
  }
  componentDidMount() {
    this.rmPlayersListener = getPlayersfromGame(1, this.stateCb);
    getTurn(1, this.stateCb);
    getPos(1, this.props.player.id, this.stateCb);
    getRound(1, this.stateCb)
  }
  componentWillUnmount() {
    this.rmPlayersListener();
  }

  stateCb(value, key) {
    this.setState({ [key]: value });
  }
  componentDidUpdate() {
    //run function corresponding to tiles array full of objects
    const { pos } = this.state;
    const tempTiles = [
      { action: () => console.log("tile 1") },
      { action: () => console.log("tile 2") },
      { action: () => console.log("tile 3") },
      { action: () => console.log("tile 4") },
      { action: () => console.log("tile 5") },
      { action: () => console.log("tile 6") },
      { action: () => console.log("tile 7") },
      { action: () => console.log("tile 8") },
    ];
    if (pos > 0) {
      tempTiles[pos - 1].action();
    }
  }

  startGame() {
    updateTurn(1, this.stateCb);
  }

  rollDice() {
    const { turn,} = this.state
    const { player,} = this.props
    const number = Math.ceil(Math.random() * 4);
    setTimeout(function(){
      updatePos(1, player.id, number)
      setTimeout(function(){
        updateTurn(1, this.stateCb);
      }, 4000)
    } , 2000)
    setTimeout(()=> updateTurn(1, this.stateCb), 2500);
  }

  render() {
<<<<<<< HEAD
    const { user } = this.props;
    const { turn, playerList } = this.state;
    const nextPlayer = playerList[user.id + 1];
    // console.log(nextPlayer);
    return (
      <div>
        {/* <h3 id="welcome">Welcome, {user.name}</h3> */}
        {playerList.map((player) => (
          <PlayerCard key={player.name} player={player} />
        ))}
=======
    const { player } = this.props;
    const { turn, playerList, round } = this.state;
    const nextPlayer = playerList[turn];
    return (
      <div>
        <h2>Game Board</h2>
        <h3>Welcome, {player.name}</h3>
        <h4>
          Lobby:
          {playerList.map((player) => (
            <div key={player.name}>
              <h5>{player.name}</h5>
            </div>
          ))}
        </h4>
>>>>>>> main
        {turn < 0 ? (
          <button onClick={() => this.startGame()}>Start Game</button>
        ) : (
          <TileGrid tileList={tileList} />
        )}
        {player.id == turn && playerList ? (
          <button onClick={() => this.rollDice()}>Roll {player.name}</button>
        ) : (
          <div>Round: {round}. Next Player: {nextPlayer ? (nextPlayer.name) : ('...')}</div>
        )}
        {turn === playerList.length ? (
        <GameCanvas />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Board;
