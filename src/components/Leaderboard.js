import React from 'react';

export default class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { players, round } = this.props;
    const sortedPlayers = players.sort((a, b) => b.score - a.score);
    // console.log(sortedPlayers);
    return (
      <div id="leaderboard">
        <p>LEADERBOARD</p>
        <p>ROUND: {round}</p>
        <div id="leader-div">
          {sortedPlayers.map((player, idx) => (
            <p className="leader-p" key={idx}>{`${idx + 1}: ${player.name} -- ${
              player.score
            }`}</p>
          ))}
        </div>
      </div>
    );
  }
}
