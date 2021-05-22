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
        <div className="flex-cont-row">
          <div className="leader-div">LEADERBOARD</div>
          <div className="leader-div">ROUND: {round}</div>
        </div>
        <div className="flex-cont-column">
          <div className="leader-div">
            {sortedPlayers.map((player, idx) => (
              <div className="leader-name-div" key={idx}>
                {`${idx + 1}:`}{' '}
                <img
                  className="tile-sprite"
                  src={player.spriteUrl}
                  alt="sprite"
                />
                {`${player.name}  --  ${player.score} points`}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
