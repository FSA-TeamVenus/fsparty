import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Lobby from './components/lobby';
import Board from './components/board';
import WelcomeScreen from './components/WelcomeScreen';
import CreatePlayer from './components/CreatePlayer';
import Lobby2 from './components/Lobby2';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path='/create' component={CreatePlayer} />
        <Route path='/lobby' component={Lobby2} />
        <Route path='/board' component={Board} />
        <Route path='/' component={WelcomeScreen} />
      </Switch>
    </div>
  );
};

export default App;
