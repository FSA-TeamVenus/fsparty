import React from 'react';
import Lobby from './components/lobby';
import Board from './components/board';
import GameCanvas from './components/GameCanvas';

const user = { name: 'Robert', id: 0 };
const App = () => {
  return (
    <div>
      {/* // <Board user={user} /> */}
      <GameCanvas />
    </div>
  );
};

export default App;
