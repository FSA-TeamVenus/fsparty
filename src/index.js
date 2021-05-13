import React from 'react';
import ReactDOM from 'react-dom';
import GameCanvas from './components/GameCanvas';
// import {Router} from 'react-router-dom'
import App from './app';

ReactDOM.render(
  // <Provider store={store}>
  // <Router history={history}>
  <App />,
  //  </Router>,
  // </Provider>,
  document.getElementById('app')
);
