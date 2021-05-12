import React from 'react';
import Board from './components/board';

const player = { name: 'Robert', id: 0 }
const App = () => {
  return (
    <div>
      <Board player={player} />
    </div>
  );
};

export default App;
