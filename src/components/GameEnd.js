import React from 'react';
import { Link } from 'react-router-dom';
import { removeFromDatabase } from '../Firebase/index';

export default class GameEnd extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    const { playerId, gameId } = this.props;
    if (playerId === 0) {
      removeFromDatabase(gameId);
    }
  }

  render() {
    const { players } = this.props;
    console.log(this.props);
    const sortedPlayers = players.sort((a, b) => a.score < b.score);
    return (
      <div id="game-end-wrap">
        <div className="background-div flex-cont-column">
          <div className="image-div" id="game-over">
            RESULTS
          </div>
          <div className="flex-cont-row podium-div">
            {sortedPlayers.map((player, idx) => (
              <div className="flex-cont-column" key={`${idx}`}>
                <img
                  src={player.spriteUrl}
                  alt="player sprite"
                  key={player.playerId}
                />
                <div id={`pod${idx}`} className="flex-cont-column podium">{`${
                  idx + 1
                }`}</div>
              </div>
            ))}
          </div>
          <div id="play-again" className="div-button box-outline">
            <Link to="/">Play Again</Link>
          </div>
        </div>
      </div>
    );
  }
}
