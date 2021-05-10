// App here?
import React from 'react';
import ReactDOM from 'react-dom';
import GameCanvas from './React/GameCanvas';
// import { Game } from './Phaser/index';

class App extends React.Component {
  render() {
    return (
      <div>
        <GameCanvas />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

// window.onload = function () {
//   window.game = new Game();
// };
