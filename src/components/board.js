import React from 'react';
import GameCanvas from './GameCanvas';
import TileGrid from './TileGrid';
import tileList from './tileList';

import {
  getPlayersfromGame,
  getTurn,
  updateTurn,
  updatePos,
  getPos,
} from '../Firebase/index';

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerList: [],
      turn: null,
      pos: null,
    };
    this.stateCb = this.stateCb.bind(this);
  }
  componentDidMount() {
    getPlayersfromGame(1, this.stateCb);
    getTurn(1, this.stateCb);
    getPos(1, this.props.user.id, this.stateCb);
  }
  stateCb(value, state) {
    this.setState({ [state]: value });
  }
  componentDidUpdate() {
    //run function corresponding to tiles array full of objects
    const { pos } = this.state;
    const tempTiles = [
      { action: () => console.log('tile1') },
      { action: () => console.log('tile 2') },
      { action: () => console.log('tile 3') },
      { action: () => console.log('tile 4') },
    ];
    if (pos > 0) {
      // tempTiles[pos - 1].action();
    }
  }

  startGame() {
    updateTurn(1, this.stateCb);
  }

  rollDice() {
    const number = Math.ceil(Math.random() * 4);
    updatePos(1, this.props.user.id, number);
    updateTurn(1, this.stateCb);
  }

  render() {
    const { user } = this.props;
    const { turn, playerList } = this.state;
    const nextPlayer = playerList[user.id + 1];
    // console.log(nextPlayer);
    return (
      <div>
        {/* <h2>Game Board</h2> */}
        <h3>Welcome, {user.name}</h3>
        <span>
          Lobby:{' '}
          {playerList.map((player) => (
            <span key={player.name}>{`${player.name}, `}</span>
          ))}
        </span>
        {turn < 0 ? (
          <button onClick={() => this.startGame()}>Start Game</button>
        ) : (
          <TileGrid tileList={tileList} />
        )}
        {user.id == turn && playerList ? (
          <button onClick={() => this.rollDice()}>Roll {user.name}</button>
        ) : (
          <div>...waiting on next player</div>
        )}
        {this.state.turn === this.state.playerList.length ? (
          <GameCanvas />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Board;
