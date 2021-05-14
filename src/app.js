import React from 'react';
import Lobby from './components/lobby';
import Board from './components/board';
<<<<<<< HEAD
import GameCanvas from './components/GameCanvas';

const user = { name: 'Robert', id: 0 };
=======
import GameCanvas from './components/GameCanvas'

const player = { name: 'Matthew', id:0


 };
>>>>>>> main
const App = () => {
  return (
    <div>
      {/* // <Board user={user} /> */}
      <GameCanvas />
    </div>
  );
};

export default App;
