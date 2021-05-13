import React from 'react';
import Lobby from './components/lobby';
import Board from './components/board';
import GameCanvas from './components/GameCanvas'

const player = { name: 'David', id: 3 }
const App = () => {
  return (
    <div>
      {/* <Lobby /> */}
      {/* <Board player={player} /> */}
      <GameCanvas />
    </div>
  );
};

export default App;
