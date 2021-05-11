import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

export class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerList: [],
      gameReady: false,
      roomId: null,
    };
  }

  sprites = [
    { name: "Kratos", imgUrl: '/pubic/kratos-avata-1.jpg'},
    { name: "Donkey Kong", imgUrl: '/pubic/donkey-kong-avatar-3.jpg'},
    { name: "Link", imgUrl: '/pubic/link-avatar-1.jpg'},
    { name: "Sonic", imgUrl: '/pubic/sonic-avatar-2.jpg'},
  ]

  componentDidMount() {

  }

  handleSubmit(evt) {
    evt.preventDefault();

  }

  handlePrev(evt){

  }

  handleNext(evt){

  }


  render() {

    return (
      <div id="lobby-window">
        <h2>FS Party</h2>
          <form onSubmit={handleSubmit} name={name} id="lobby-form">
            {error && error.response && <p> {error.response.data} </p>}
            <div className="input-div">
              <label htmlFor="playername">
                <small>Player Name</small>
              </label>
              <input name="playername" type="text" className="lobby-input" />
            </div>
            <div className="input-div">
              <label htmlFor="playercolor">
                <small>Player Color</small>
              </label>
              <select name="playercolor" className="lobby-input">
                <option value="Blue">Blue</option>
                <option value="Red">Blue</option>
                <option value="Green">Blue</option>
                <option value="Yelow">Blue</option>
              </select>
            </div>
            <div className="input-div">
              <div name="sprite-image"></div>
              <label htmlFor="playersprite">
                <small>Select Character</small>
              </label>
              <button type="button" id="prev-sprite" onclick={handlePrev}></button>
              <input name="playersprite" type="text" className="lobby-input" />
              <button type="button" id="next-sprite" onclick={handleNext}></button>
            </div>
            <button type="submit" id="form-submit">
              {displayName}
            </button>
          </form>
      </div>
    );
  }
}

export default Lobby;
