import React from 'react';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { id, actionType } = this.props.tileProps;
    const players = this.props.players || [];
    return (
      <div className={`tile ${actionType}`}>
        {/* {players.length
          ? players.map((player) => {
              if (player.position === id) {
                return <p key={player.playerId}>{player.name}</p>;
              }
            })
          : ''} */}
      </div>
    );
  }
}
