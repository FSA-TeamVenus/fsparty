import React from 'react';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { tileType, id, actionType } = this.props.tileProps;
    return <div className={`tile ${tileType} ${actionType}`}>{id}</div>;
  }
}
