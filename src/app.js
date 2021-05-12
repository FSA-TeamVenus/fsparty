import React from 'react';
import Board from './components/board';

const player = { name: 'David', id: 3 }
const App = () => {
  return (
    <div>
      <Board player={player} />
    </div>
  );
};

export default App;
