import React from 'react';

export default class PlayerCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { player } = this.props;
    return (
      <div
        className={`card ${player.color}-text flex-cont-column`}
        id={`card${player.playerId}`}
      >
        <div className="card-sprite-div">
          <div>{player.name}</div>
          <img
            src={player.spriteUrl}
            alt="sprite"
            className="card-sprite"
          ></img>
        </div>
      </div>
    );
  }
}
