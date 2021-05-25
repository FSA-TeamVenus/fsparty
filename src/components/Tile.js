import React from 'react';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { id, actionType } = this.props.tileProps;
    const { players, dictionary } = this.props;
    return (
      <div className={`tile ${actionType} flex-cont-row circle`}>
        {players.map((player) => {
          if (dictionary[player.position].id === id) {
            return (
              <div key={player.playerId}>
                <img
                  className="tile-sprite"
                  src={player.spriteUrl}
                  alt="sprite"
                />
              </div>
            );
          }
        })}
        <div className="tile-action">{`${actionType}`}</div>
      </div>
    );
  }
}
