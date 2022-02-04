import { render } from '@testing-library/react';
import './App.css';
import Game from './game';
import GameHooks from './game_hooks';
import { createStore } from "redux";
import { Provider } from "react-redux";


const initialState = {
  deck: [],
  player1_hand: [],
  player2_hand: [],
  player1_cards_played: [],
  player2_cards_played: [],
  cards_to_be_won: [],
  play: false,
  speed: 1000,
}


function reducer(state=initialState, action) {
  return {
    
  }  
}

const store = createStore(reducer);


const App = () => (
    <Provider store={store} className="App">
      <h1 id='title'>WAR!</h1>      
      {/* <Game/>         */}
      <GameHooks/>        
    </Provider>
)

export default App;
