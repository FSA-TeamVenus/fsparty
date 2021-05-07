import React from 'react';
import Board from './components/board';

const user = { name: 'robert', pos: 0 }
const App = () => {
  return (
    <div>
      <Board user={user} turn={'robert'}/>
    </div>
  );
};

export default App;
