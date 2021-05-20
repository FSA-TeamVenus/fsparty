import React from 'react';
import { Link } from 'react-router-dom';
import { removeFromDatabase } from '../Firebase/index';

export default class GameEnd extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { playerId, gameId } = this.props.location.state;
    if (playerId === 0) {
      removeFromDatabase(gameId);
    }
  }

  render() {
    const { players } = this.props.location.state;
    return (
      <div>
        <div className="background-div flex-cont-column">
          <div className="image-div" id="game-over">
            GAME OVER
          </div>
          <div className="flex-cont-row">
            {players.map((player) => (
              <img
                src={player.spriteUrl}
                alt="player sprite"
                key={player.playerId}
              />
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
