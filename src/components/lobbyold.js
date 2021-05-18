import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

export class LobbyOld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerList: [],
      gameReady: false,
      gameId: null,
      sprites: [
        { name: "Kratos", imgUrl: 'kratos-avatar-1.jpg'},
        { name: "Donkey Kong", imgUrl: 'donkey-kong-avatar-2.jpg'},
        { name: "Link", imgUrl: 'link-avatar-1.jpg'},
        { name: "Sonic", imgUrl: 'sonic-avatar-2.jpg'},
      ],
      avatarThumb: 'kratos-avatar-1.jpg',
      avatarName: "Kratos",
      selectedColor: 'black'
    };
    this.handleColorSelect = this.handleColorSelect.bind(this);
    this.handleAvatarNav = this.handleAvatarNav.bind(this);
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
    this.setState(
      {
        selectedColor: color
      }
    )
  }

  handleAvatarNav(evt) {
    const currAvatar = this.state.avatarName;
    const direction = Number(evt.target.value);
    let elementPos = this.state.sprites.map(function(x) { return x.name; }).indexOf(currAvatar);

    if((elementPos === 0 && direction === 1) || (elementPos === 3 && direction === -1))
    {
      return //at either boundary, do nothing
    } else {
      const avatarFound = this.state.sprites[elementPos - direction];
      this.setState(
        {
          avatarThumb: avatarFound.imgUrl,
          avatarName: avatarFound.name
        }
      )
    }
  }


  render() {

    const { avatarThumb, avatarName, selectedColor } = this.state;

    return (
      <div id="lobby-window">
        <h2 className="title">FS Party</h2>
          <form name={name} id="lobby-form">
          <div className="form-row">
            <div className="form-col">
            <div className="input-div">
              <label htmlFor="playername">
                Enter Name
              </label>
              <input name="playername" type="text" className="lobby-input" />
            </div>
            <div className="input-div">
              <label htmlFor="playercolor">
                Select Color
              </label>
              <select name="playercolor" className="lobby-input" onChange={this.handleColorSelect}>
              <option value=""></option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              </select>
              <div id="selected-color" className={`selected-color ${selectedColor}`}></div>
            </div>
          </div>
          <div className="form-col">
            <div className="input-div">
              <div name="sprite-image"></div>
              <label htmlFor="playersprite">
                Select Character
              </label>
              <div className="form-row">
                <button type="button" id="prev-sprite" onClick={this.handleAvatarNav} value="1">prev</button>
                <img id="avatar-thumb" src={avatarThumb} className="avatar"/>
                <button type="button" id="next-sprite" onClick={this.handleAvatarNav} value="-1">next</button>
              </div>
            </div>
            <div id="sel-color-div" className="input-div">
              <input id="avatar-name" name="playersprite" type="text" className="lobby-input" value={avatarName} />
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
