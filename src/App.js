import { render } from '@testing-library/react';
import './App.css';
import Game from './game';

function App() {
  return (
    <div className="App">
      <h1>WAR</h1>
      <button>SEE ALTIME SCORES</button>
      <br></br>
      <button>Play!</button>
      <Game/>        
    </div>
  );
}

export default App;
