import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { addPlayer, getNewId, deleteBranch } from '../Firebase';

export class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: {},
      gameReady: false,
      gameState: null,
      gameId: null,
      sprites: [
        { name: "Kratos", imgUrl: 'assets/images/kratos-avatar-1.jpg'},
        { name: "Donkey Kong", imgUrl: 'assets/images/donkey-kong-avatar-2.jpg'},
        { name: "Link", imgUrl: 'assets/images/link-avatar-1.jpg'},
        { name: "Sonic", imgUrl: 'assets/images/sonic-avatar-2.jpg'},
      ],
      avatarThumb: 'assets/images/kratos-avatar-1.jpg',
      avatarName: "Kratos",
      selectedColor: 'black'
    };
    this.handleColorSelect = this.handleColorSelect.bind(this);
    this.handleAvatarNav = this.handleAvatarNav.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleSelectNew = this.handleSelectNew.bind(this);
    this.handleSelectJoin = this.handleSelectJoin.bind(this);
  }

  componentDidMount() {

    //DO NOT UNCOMMENT!!!
    //THIS WILL DELETE ENTIRE `main/players` BRANCH
    //ONLY USED IN EMERGENCY WHEN ENDLESS LOOP ADDED 600 RECORDS TO DB!
    //deleteBranch();

  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.addNewPlayer();
  }

  handleNewGame() {
    //TODO: generate new gameId or grab existing if joining a game
    const gameId = 1;

    //This function contacts firebase to get new playerId,
    //then sets that Id in state
    getNewId(gameId, data => {
      const playerId = Object.keys(data).length;
      this.setState(
        {
          player: { id: playerId },
          gameState: 'NEW_GAME'
        }
      )
    });
  }

  async handleJoinGame() {
    //get game Id entered by user
    const gameId = document.getElementById('game-id').value;
    const exists = true;
    let STATE = 'ENTER_LOBBY'

    //TODO: validate gameId
    // checkGameId(gameId, data => {
    //   const exists = Object.keys(data).find( key => {
    //       return key === gameId
    //   });

      if (!exists) STATE = 'JOIN_GAME'

      await this.handleNewGame();
      this.setState(
        {
          gameState: STATE
        }
      )


    //});
  }

  createNewPlayer() {
    const playerName = document.getElementById('playername').value;
    const color = document.getElementById('playercolor').value;
    const sprite = document.getElementById('avatarname').value;

    this.setState(
      {
        player: 
        { 
          name: playerName,
          color: color,
          sprite: sprite 
        }
      }
    )
  }

  async addNewPlayer() {
    const newPlayer = await this.createNewPlayer(playerId);
    const { id, name, color, sprite } = this.state.player;
    console.log(id)
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
      
      const STATE = "ENTER_LOBBY"

      this.setState(
        {
          gameState: STATE
        }
      )
  }

  handleStart() {
    let STATE = this.state.gameState;

    switch (STATE) {
      case "START_NEW_GAME":
        this.handleNewGame();
        break;
      case "JOIN_GAME":
        this.handleJoinGame();
        break;
    
      default:
        break;
    }
  }

  handleSelectNew(evt) {
    let TYPE = 'START_NEW_GAME'
    this.setState(
      {
        gameState: TYPE
      }
    )
  }

  handleSelectJoin(evt) {
    let TYPE = 'JOIN_GAME'
    this.setState(
      {
        gameState: TYPE
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

    const { player, avatarThumb, avatarName, selectedColor, gameId, gameReady, gameState } = this.state;

    const showDiv = gameState === "JOIN_GAME" ? "show-content" : "hide-content";

    return (
      <div id="lobby-window">
        <h2 className="title">FS Party</h2>
        { gameState === "ENTER_LOBBY" ?
          (
            <div id="lobby-waiting">
                Waiting ....
            </div>
          )
          :
          (
            gameState === "NEW_GAME"  ?
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
            :
            (<div >
                <label htmlFor="new-game">
                  Create new game?
                </label>
                <input id="new-game" name="choose-game" type="radio" onClick={this.handleSelectNew} className="lobby-input" value="new" />
                <label htmlFor="existing-game">
                  Join existing game?
                </label>
                <input id="existing-game" name="choose-game" type="radio" onClick={this.handleSelectJoin} className="lobby-input" />
                <div className="input-div">
                  <div id="enter-game-id" className={showDiv}>
                    <label htmlFor="game-id">
                      Enter Game ID:
                    </label>
                    <input id="game-id" name="game-id" type="text" className="lobby-input" value={gameId} />
                  </div>
                  <button type="button" id="game-start" onClick={this.handleStart}>
                    START
                  </button>
                </div>
             </div>
            )
          )
        }
      </div>
    );
  }
}

export default Lobby;
