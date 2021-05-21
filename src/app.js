import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Lobby from './components/lobby';
import Board from './components/board';
import WelcomeScreen from './components/WelcomeScreen';
import CreatePlayer from './components/CreatePlayer';
import Lobby2 from './components/Lobby2';
import JoinGame from './components/JoinGame';
import GameEnd from './components/GameEnd';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path='/join' component={JoinGame} />
        <Route path='/create' component={CreatePlayer} />
        <Route path='/lobby' component={Lobby2} />
        <Route path='/board' component={Board} />
        <Route path='/' component={WelcomeScreen} />
      </Switch>
    </div>
  );
};

export default App;
