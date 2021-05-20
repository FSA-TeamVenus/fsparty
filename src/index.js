import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';
import useSound from 'use-sound';
import themeSfx from '../docs/assets/sounds/mario-theme-8bit.mp3';

// Create theme music object and play it
const themeAudio = new Audio(themeSfx);
themeAudio.play();

// Create history object.
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

// Listen to history changes.
// You can unlisten by calling the constant (`unlisten()`).
const unlisten = history.listen((location, themeAudio, action) => {
  console.log(action, location.pathname, location.state);
  //if (location === 'board')
      //themeAudio.pause();
});


ReactDOM.render(
  <Router history={history}>
    <App themeAudio={themeAudio} />
  </Router>,

  document.getElementById('app')
);
