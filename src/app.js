import React from 'react';
import Lobby from './components/lobby';
import Board from './components/board';
import GameCanvas from './components/GameCanvas'

const player = { name: 'Gabe', id: 1 };
const App = () => {
  return (
    <div>
      {/* <Lobby /> */}
      <Board player={player} />
    </div>
  );
};

export default App;
