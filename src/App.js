import React from 'react';
import { HashRouter } from 'react-router-dom';
import Routes from "./Routes";

import './App.css';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes />
      </HashRouter>
    </div>
  );
}

export default App;
