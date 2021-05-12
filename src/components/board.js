import React from 'react';
import GameCanvas from './GameCanvas';

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
    getPos(1, this.props.player.id, this.stateCb);
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
    updatePos(1, this.props.player.id, number);
    updateTurn(1, this.stateCb);
  }

  render() {
    const { player } = this.props;
    const { turn, playerList } = this.state;
    const nextPlayer = playerList[player.id + 1];
    console.log(nextPlayer);
    return (
      <div>
        <h2>Game Board</h2>
        <h3>Welcome, {player.name}</h3>
        <h4>
          Lobby:{' '}
          {playerList.map((player) => (
            <div key={player.name}>
              <h5>{player.name}</h5>
            </div>
          ))}
        </h4>
        {turn < 0 ? (
          <button onClick={() => this.startGame()}>Start Game</button>
        ) : (
          <div>Display Board</div>
        )}
        {player.id == turn && playerList ? (
          <button onClick={() => this.rollDice()}>Roll {player.name}</button>
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
