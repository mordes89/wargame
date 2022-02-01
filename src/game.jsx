import React from 'react';
// import Deck from './deck';


let suits = ["Hearts", "Clubs", "Diamonds", "Spades"]
let values = [["two", 2], ["three", 3], ["four", 4], ["five", 5], ["six", 6], ["seven", 7], ["eight", 8], ["nine", 9], ["ten", 10], ["jack", 11], ["queen", 12], ["king", 13], ["ace", 14]]
let deck = []
for (let i = 0; i < values.length; i++) {
   for (let j = 0; j < suits.length; j++) {
      deck.push([`${values[i][0]} of ${suits[j]}`, values[i][1]])      
   }
}  



let player1_hand = []
let player2_hand = []
let i = 0;

while (deck.length > 0){
   let random_card = Math.floor(Math.random()*deck.length);
   if (i%2 === 0){
      player1_hand.push(deck[random_card])
   } else {
      player2_hand.push(deck[random_card])
   }
   deck.splice(random_card, 1)
   i++;
}




class Game extends React.Component {   
   constructor(props) {
      super(props);
   }
   render(){
      console.log('deck',deck);
      console.log('player1_hand',player1_hand);
      console.log('player2_hand',player2_hand);
      return(
         <div>
            {/* <Deck/> */}         
            <ul>
               {deck.map((k) => (
                  <h3 key={`deck-${k}`}>
                     {k[0]}:
                     {k[1]}
                  </h3>
                  )
               )}
            </ul>            
         </div>
      )
   }   
}
export default Game;