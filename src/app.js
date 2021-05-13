import React from 'react';
import Board from './components/board';

const player = { name: 'Gabe', id: 1 };
const App = () => {
  return (
    <div>
      <Board player={player} />
    </div>
  );
};

export default App;
