import React from 'react';

export default class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { players, startMiniGame, turn, playerId } = this.props;
    const sortedPlayers = players.sort((a, b) => b.score - a.score);
    return (
      <div id="leaderboard">
        <div className="flex-cont-row">
          <div className="leader-div">LEADERBOARD</div>
        </div>
        <div className="flex-cont-column">
          <div className="leader-div">
            {sortedPlayers.map((player, idx) => (
              <div className="leader-name-div" key={idx}>
                {`${idx + 1}:`} {`${player.name}  --  ${player.score} points`}
              </div>
            ))}
          </div>
        </div>
        {turn === players.length && playerId === 0 ? (
          <button className="mini-game-button" onClick={startMiniGame}>
            start mini game
          </button>
        ) : (
          <div />
        )}
      </div>
    );
  }
}
