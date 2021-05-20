import React from 'react';

export default class PlayerCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { player } = this.props;
    console.log(player);
    return (
      <div
        className={`card ${player.color} flex-cont-column`}
        id={`card${player.playerId}`}
      >
        <p>{player.name}</p>
        <div className="card-sprite-div">
          <img
            src={player.spriteUrl}
            alt="sprite"
            className="card-sprite"
          ></img>
        </div>
        <p>Score: {player.score}</p>
      </div>
    );
  }
}
