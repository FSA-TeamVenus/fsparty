import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Board from './components/board';
import WelcomeScreen from './components/WelcomeScreen';
import CreatePlayer from './components/CreatePlayer';
import GameSettings from './components/GameSettings';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path="/create" component={CreatePlayer} />
        <Route path="/settings" component={GameSettings} />
        <Route path="/board" component={Board} />
        <Route path="/" component={WelcomeScreen} />
      </Switch>
    </div>
  );
};

export default App;
