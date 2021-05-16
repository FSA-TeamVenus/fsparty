import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { addPlayer, getNewId, deleteBranch } from '../Firebase';

export class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: {},
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
  }

  componentDidMount() {

    //DO NOT UNCOMMENT!!!
    //THIS WILL DELETE ENTIRE `main/players` BRANCH
    //ONLY USED IN EMERGENCY WHEN ENDLESS LOOP ADDED 600 RECORDS TO DB!
    //deleteBranch();

  }

  createNewPlayer(playerId) {
    const playerName = document.getElementById('playername').value;
    const color = document.getElementById('playercolor').value;
    const sprite = document.getElementById('avatarname').value;

    return {
      playerId: playerId,
      name: playerName,
      color: color,
      sprite: sprite
    };
  }


  handleSubmit(evt) {
    evt.preventDefault();
    this.addNewPlayer();
  }

  handleNewGame(evt) {
    //TODO: generate new gameId or grab existing if joining a game
    const gameId = 1;

    //This function contacts firebase to get new playerId,
    //then sets that Id in state
    getNewId(gameId, data => {
      const playerId = Object.keys(data).length;
      const newPlayer = this.createNewPlayer(playerId);
      this.setState(
        {
          player: newPlayer
        }
      )
    });
  }

  addNewPlayer() {
    const { playerId, name, color, sprite } = this.state.player;
    console.log(playerId)
    console.log(name)
    console.log(color)
    console.log(sprite)

    //call firebase.addPlayer(gameId, playerId, playerObj)
    if(playerId < 4) {
      addPlayer(1, playerId,
        {
          name: name,
          position: 0,
          score: 0,
          color: color,
          sprite: sprite
        });

        //TODO: set local storage for gameId, playerid
      }

      this.setState(
        {
          gameReady: true
        }
      )
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

    const { player, avatarThumb, avatarName, selectedColor, gameId, gameReady } = this.state;

    return (
      <div id="lobby-window">
        <h2 className="title">FS Party</h2>
        { gameReady ?
          (
            <div id="lobby-waiting">
                Waiting ....
            </div>
          )
          :
          (
            player.playerId ?
            (<div className="input-div">
                <label htmlFor="new-game">
                  Create new game?
                </label>
                <input id="new-game" name="choose-game" type="radio" onClick={this.handleNewGame} className="lobby-input" value="new" />
                <label htmlFor="existing-game">
                  Join existing game?
                </label>
                <input id="existing-game" name="choose-game" type="radio" onClick={this.handleJoinGame} className="lobby-input" value="existing" />
                <label htmlFor="game-id">
                  Join existing game?
                </label>
                <input id="game-id" name="game-id" type="text" className="lobby-input" value={gameId} disabled />
            </div>
            )
            :
            (<form name={name} id="lobby-form" onSubmit={this.handleSubmit}>
              <div className="form-row">
                <div className="form-col">
                <div className="input-div">
                  <label htmlFor="playername">
                    Enter Name
                  </label>
                  <input id="playername" name="playername" type="text" className="lobby-input" />
                </div>
                <div className="input-div">
                  <label htmlFor="playercolor">
                    Select Color
                  </label>
                  <select id="playercolor" name="playercolor" className="lobby-input" onChange={this.handleColorSelect}>
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
                  <input id="avatarname" name="playersprite" type="text" className="lobby-input" value={avatarName} />
                </div>
              </div>
              </div>
              <div className="input-div">
                <button type="submit" id="form-submit">
                  JOIN!
                </button>
                <input id="playerId" name="playerId" type="text" className="lobby-input" value={player.playerId} />
              </div>
              </form>
            )
          )
        }
      </div>
    );
  }
}

export default Lobby;
