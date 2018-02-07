import * as React from 'react';
import './App.css';

import ViewController from './viewmodels/viewController';

const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    return (
      <ViewController /> 
    );
  }
}
export default App;
