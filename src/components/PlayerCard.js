import React from 'react';

export default class PlayerCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { player } = this.props;
    return (
      <div className="card" id={`card${player.playerId}`}>
        <p>{player.name}</p>
        <p>{player.score}</p>
      </div>
    );
  }
}
