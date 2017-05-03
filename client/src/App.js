import React, { Component } from 'react';
import { Socket } from 'react-socket-io';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { yellow700 } from 'material-ui/styles/colors';
import Tessel from './Tessel';
import logo from './logo.svg';
import './App.css';

const myTheme = getMuiTheme({
  checkbox: {
    checkedColor: yellow700,
  },
  slider: {
    selectionColor: "gray",
  }
})

class App extends Component {
  render() {
    const url = 'http://192.168.1.166:3000'
    const options = { transports: ['websocket'] }

    return (
      <MuiThemeProvider muiTheme={ myTheme }>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Lab2: Tessel Practice</h2>
          </div>
          <div className="App-content">
            <Socket url={url} options={options}>
              <Tessel />
            </Socket>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
