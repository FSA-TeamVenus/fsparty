import React from 'react';
import Lobby from './components/lobby';
import Board from './components/board';

const user = { name: 'Robert', id: 0 }
const App = () => {
  return (
    <div>
      {/* <Board user={user} /> */}
      <Lobby />
    </div>
  );
};

export default App;
