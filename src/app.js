import React from 'react';
import Board from './components/board';

const user = { name: 'Robert', id: 0 }
const App = () => {
  return (
    <div>
      <Board user={user} />
    </div>
  );
};

export default App;
