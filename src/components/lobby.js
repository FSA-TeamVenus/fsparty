import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { addPlayer, addGame, getNewId, getNewGameId, validateGameId, deleteBranch, deleteKey } from '../Firebase';

export class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: {},
      gameReady: false,
      gameState: '',
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
    /*
    getNewGameId(data => { 
      Object.keys(data).filter(key => {
        if (Number(key) > 4) deleteKey(key)
      })
    })
    */
  }

  getRadioValue(radio) {
    let ele = radio;
    let val;
    for(let i = 0; i < ele.length; i++) {
        if(ele[i].checked)
        val = ele[i].value;
    }
    return val;
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    const isNewGame = this.getRadioValue(document.getElementsByName('choose-game')) === 'new' ? true : false;
    console.log("radio button===>", isNewGame)

    if(!isNewGame)  
      await this.addNewGame();

    await this.addNewPlayer();
  }

  addNewGame(){
    const gameId = this.state.gameId
    // add new Game info to firebase
    const gameInfo = {
      main: {
        players: {
          0: {
            name: 'new_player'
          }
        }
      }
    }
    addGame(gameId, gameInfo)
  }

  getPlayerId() {
    let STATE = 'NEW_GAME'
    const gameId = this.state.gameId

    //This function contacts firebase to get new playerId,
    //then sets that Id in state
    getNewId(gameId, data => {
      let playerId
      if (!gameId) {
        //null game id passed into handleNewGame() so this is a new game set first player to id: 0
        playerId = 0
      } else {
        //existing game Id was passed into handleNewGame() so set player to next available id 
        playerId = Object.keys(data).length;
      }
      this.setState(
        {
          player: { id: playerId },
          gameState: STATE,
        }
      )
      console.log("New Player ID: ===>", playerId)
    });
  }

  findNextNumber(sequence) {
    const length = sequence.length;
    for (let i=0; i<length; i++) {
        let x = i + 1;
        //console.log(`Key: ${Number(sequence[i])} x: ${x}`)
        if (Number(sequence[i]) !== x) {
            sequence.splice(i, 0, x); // insert x here
            sequence.length = length; // chop off the rest
            return x;
        }
    }
    // else
    return length + 1; //array length + 1 as next number 
  }

  getGameId(gameId) {
    //generate new gameId or grab existing if joining a game,
    // then sets that gameId in state
    getNewGameId(gameId, data => {
      let STATE = 'NEW_GAME'
      let newGameId = 0;
      console.log(!gameId)
      if (!gameId) {
        newGameId = this.findNextNumber(Object.keys(data));
      } else {
        newGameId = gameId
      }
      this.setState(
        {
          gameId: newGameId,
          gameState: STATE
        }
      )
      console.log("Game ID: ===>", newGameId)
    }) 
  }

  async handleNewGame(gameId) {
    await this.getGameId(gameId);
    await this.getPlayerId();
  }

  async handleJoinGame() {
    //get game Id entered by user
    const gameId = document.getElementById('game-id').value;
    console.log("game id: ", gameId)
    //validate gameId
    validateGameId(gameId, async valid => {
      let STATE = 'ENTER_LOBBY'
      if(!valid) {
        STATE = 'JOIN_GAME'
      } else {
        await this.handleNewGame(gameId);
      }
      this.setState(
        {
          gameState: STATE
        }
      )
    });
  }

  saveNewPlayerToState(newPlayer) {
    this.setState(
      {
        player: newPlayer
      }
    )
  }

  async addNewPlayer() {
    const playerId = document.getElementById('playerId').value;
    const playerName = document.getElementById('playername').value;
    const color = document.getElementById('playercolor').value;
    const sprite = document.getElementById('avatarname').value;

    const newPlayer = { 
      id: playerId,
      name: playerName,
      color: color,
      sprite: sprite 
    }
 
    await this.saveNewPlayerToState(newPlayer);

    console.log(playerId)
    console.log(playerName)
    console.log(color)
    console.log(sprite)

    //call firebase.addPlayer(gameId, playerId, playerObj)
    if(playerId < 4) {
      addPlayer(this.state.gameId, playerId,
        {
          name: playerName,
          position: 0,
          score: 0,
          color: color,
          sprite: sprite
        });

        //save player object in local storage 
        window.localStorage.setItem('player', JSON.stringify(newPlayer));
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
        this.handleNewGame(null);
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
        gameState: TYPE,
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
                <input id="playerId" name="playerId" type="text" className="lobby-input" value={player.id} />
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
                <input id="existing-game" name="choose-game" type="radio" onClick={this.handleSelectJoin} className="lobby-input" value="join" />
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
