import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

export class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerList: [],
      gameReady: false,
      gameId: null,
      sprites: [
        { name: "Kratos", imgUrl: '/pubic/kratos-avatar-1.jpg'},
        { name: "Donkey Kong", imgUrl: '/pubic/donkey-kong-avatar-2.jpg'},
        { name: "Link", imgUrl: '/pubic/link-avatar-1.jpg'},
        { name: "Sonic", imgUrl: '/pubic/sonic-avatar-2.jpg'},
      ]
    };
    this.handleColorSelect.bind = this.handleColorSelect;
    this.handleAvatarNav.bind = this.handleAvatarNav;
  }

  componentDidMount() {

  }

  handleSubmit(evt) {
    // evt.preventDefault();
    // const playerName = evt.target.playername;
    // this.state.setState(
    //   { playerList: [...playerList, playerName] }
    // )
  }

  handleColorSelect(evt) {
    const color = evt.target.value === ''? 'Black' : evt.target.value;
    const box = document.getElementById('selected-color');
    box.style.backgroundColor = `${color}`;
  }

  handleAvatarNav(evt) {
    currAvatar = document.getElementById('avatar-name').value;
    let elementPos = sprites.map(function(x) {return x.name; }).indexOf(currAvatar);
    if(elementPos === 0 || elementPos === 3) { //at either boundary, do nothing
      return
    } else {
      const direction = evt.target.value;
      const avatarFound = sprites[elementPos - direction];
      const img = document.getElementById('avatar-thumb');
      img.src = avatarFound.imgUrl;
      const textbox = document.getElementById('avatar-name');
      textbox.value = avatarFound.name;
    }
  }


  render() {

    return (
      <div id="lobby-window">
        <h2 className="title">FS Party</h2>
          <form name={name} id="lobby-form">
        <div className="form-row">
            <div className="form-col">
            <div className="input-div">
              <label htmlFor="playername">
                <small>Enter Name</small>
              </label>
              <input name="playername" type="text" className="lobby-input" />
            </div>
            <div className="input-div">
              <label htmlFor="playercolor">
                <small>Select Color</small>
              </label>
              <select name="playercolor" className="lobby-input" onchange={this.handleColorSelect}>
              <option value=""></option>
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
              </select>
              <div id="selected-color" className="selected-color"></div>
            </div>
          </div>
          <div className="form-col">
            <div className="input-div">
              <div name="sprite-image"></div>
              <label htmlFor="playersprite">
              <small>Select Character</small>
              </label>
              <div className="form-row">
                <button type="button" id="prev-sprite" onclick={this.handleAvatarNav} value="1">prev</button>
                <img id="avatar-thumb" src="kratos-avatar-1.jpg" className="avatar"/>
                <button type="button" id="next-sprite" onclick={this.handleAvatarNav} value="-1">next</button>
              </div>
            </div>
            <div id="sel-color-div" className="input-div">
              <input id="avatar-name" name="playersprite" type="hidden" className="lobby-input" value="Kratos" />
            </div>
          </div>
          </div>
          <div className="input-div">
            <button type="submit" id="form-submit">
              JOIN!
            </button>
          </div>
          </form>
        </div>
    );
  }
}

export default Lobby;
