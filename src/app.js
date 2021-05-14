import React from 'react';
import Lobby from './components/lobby';
import Board from './components/board';
import GameCanvas from './components/GameCanvas';

const player = { name: 'Matthew', id: 1 };

const App = () => {
  return (
    <div>
      {/* // <Board user={user} /> */}
      <GameCanvas />
    </div>
  );
};

export default App;
