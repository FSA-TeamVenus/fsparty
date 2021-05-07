import React from 'react'

export class Board extends React.Component {
  constructor(props) {
    super(props)
  }

  startGame() {
    //starting turn cycle
    const { user, turn, } = this.props;
    let turns = [ 'robert', 'david', 'end' ];
    turn = turns[0]
    //while(turns) if current turn is 'end' launch phaser game
  }

  rollDice() {
    const { user } = this.props
    const number = Math.ceil(Math.random() * 6);
    console.log(number)
    user.pos += number;
  }

  render() {
    const { user, turn } = this.props;

    return (
      <div>
        <h2>Game Board</h2>
        <h3>Welcome, {user.name}</h3>
        {user.name === turn ? (<button onClick={()=> this.rollDice()}></button>) : (<div></div>)}
      </div>
    )
  }
}

export default Board
