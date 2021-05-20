import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Board from './components/board';
import WelcomeScreen from './components/WelcomeScreen';
import CreatePlayer from './components/CreatePlayer';
import JoinGame from './components/JoinGame';
import Lobby from './components/Lobby';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path='/create' component={CreatePlayer} />
        <Route path='/join' component={JoinGame} />
        <Route path='/lobby' component={Lobby} />
        <Route path='/board' component={Board} />
        <Route path='/' component={WelcomeScreen} />
      </Switch>
    </div>
  );
};

export default App;
