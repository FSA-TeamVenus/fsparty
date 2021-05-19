import React from 'react';
import Tile from './Tile';

export default class TileGrid extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { tileList, playerList, dictionary } = this.props;

    return (
      <div className="tile-grid">
        {tileList.map((tile) =>
          dictionary[tile.id] ? (
            <Tile
              tileProps={tile}
              players={playerList}
              key={tile.id}
              dictionary={dictionary}
            />
          ) : (
            <Tile
              tileProps={tile}
              players={playerList}
              key={tile.id}
              dictionary={null}
            />
          )
        )}
      </div>
    );
  }
}
