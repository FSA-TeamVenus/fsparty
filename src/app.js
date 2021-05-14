import React from 'react';
import Lobby from './components/lobby';
import Board from './components/board';
import GameCanvas from './components/GameCanvas'

<<<<<<< HEAD
const player = { name: 'Matthew', id: 1 };
=======
const player = { name: 'Matthew', id:0


 };
>>>>>>> main
const App = () => {
  return (
    <div>
      {/* <Lobby /> */}
      <Board player={player} />
    </div>
  );
};

export default App;
