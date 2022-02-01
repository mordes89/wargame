import { render } from '@testing-library/react';
import React from 'react';

// Queue of cards in an array (unshift ro add to the back of the line.
// pop to pull out another card)
// 

class Game extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         start: false,
         player1: 0,
         player2: 0
      }
   }





   render(){
      return(
         <div>

         </div>
      )
   }   
}
export default Game;