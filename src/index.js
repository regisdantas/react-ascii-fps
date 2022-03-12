import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GamePage from './GamePage';
import Game from './components/Game/Game';

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);

