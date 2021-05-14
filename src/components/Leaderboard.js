import React from 'react';

export default class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { players } = this.props;
    const sortedPlayers = players.sort((a, b) => b.score - a.score);
    return (
      <div id="leaderboard">
        <h3>LEADERBOARD</h3>
        <div id="leader-div">
          {sortedPlayers.map((player, idx) => (
            <p className="leader-p" key={player.playerId}>{`${idx + 1}: ${
              player.name
            } -- ${player.score}`}</p>
          ))}
        </div>
      </div>
    );
  }
}
