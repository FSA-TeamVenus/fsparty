import React from 'react';
import ReactDOM from 'react-dom';
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

// import GameCanvas from './React/GameCanvas';

// class App extends React.Component {
//   render() {
//     return (
//       <div>
//         <GameCanvas />
//       </div>
//     );
//   }
// }

// ReactDOM.render(<App />, document.getElementById('app'));
