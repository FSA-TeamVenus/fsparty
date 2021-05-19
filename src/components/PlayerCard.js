import React from 'react';

export default class PlayerCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { player } = this.props;
    return (
      <div className={`card ${player.color}`} id={`card${player.playerId}`}>
        <p>{player.name}</p>
        <p>Score: {player.score}</p>
      </div>
    );
  }
}
