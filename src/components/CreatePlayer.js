import React from 'react';
import { addPlayerToGame } from '../Firebase/index';
import { Link } from 'react-router-dom';
import { GameTitle } from './GameTitle';
import btnClickAudio from '../../docs/assets/sounds/btn-click.mp3';

export default class CreatePlayer extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      color: '',
      sprite: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleBtnClick() {
    const sound = new Audio(btnClickAudio);
    sound.play();
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  handleCancel(evt) {
    this.handleBtnClick();
    window.localStorage.removeItem('gameId');
    this.setState({
      gameId: '',
    });
  }

  handleSubmit() {
    this.handleBtnClick();
    const playerId = Number(window.localStorage.getItem('idKey'));
    const gameId = window.localStorage.getItem('gameId');
    const playerObj = { ...this.state, playerId };
    addPlayerToGame(gameId, playerId, playerObj);
  }

  render() {
    return (
      <div className="input-div">
        <GameTitle />
        <h1>Create Your Player</h1>
        <form onSubmit={this.handleSubmit} className="center-box">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
            className="center-box"
          ></input>
          <label htmlFor="color">Color</label>
          <select
            name="color"
            value={this.state.color}
            onChange={this.handleChange}
            className="center-box"
          >
            <option value={''}>---</option>
            <option value={'blue'}>blue</option>
            <option value={'green'}>green</option>
            <option value={'pink'}>pink</option>
            <option value={'red'}>red</option>
          </select>
          <label htmlFor="sprite">Sprite</label>
          <select
            name="sprite"
            value={this.state.sprite}
            onChange={this.handleChange}
            className="center-box"
          >
            <option value={''}>---</option>
            <option value={'link'}>link</option>
            <option value={'kratos'}>kratos</option>
            <option value={'donkeyKong'}>donkey kong</option>
            <option value={'sonic'}>sonic</option>
          </select>
          <Link to="/board">
            {/* <button onClick={this.handleSubmit}>Join Game</button> */}
            <img onClick={this.handleSubmit} className="join-gm-btn" src="../../assets/images/join-game-btn.png" />
          </Link>
          <Link to="/">
            {/* <button onClick={this.handleCancel}>Cancel</button> */}
            <img onClick={this.handleBtnClick} className="join-gm-btn" src="../../assets/images/cancel-btn.png" />
          </Link>
        </form>
      </div>
    );
  }
}
