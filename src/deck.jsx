import React from 'react';

let suits = ["Hearts", "Clubs", "Diamonds", "Spades"]
let values = [["two", 2], ["three", 3], ["four", 4], ["five", 5], ["six", 6], ["seven", 7], ["eight", 8], ["nine", 9], ["ten", 10], ["jack", 11], ["queen", 12], ["king", 13], ["ace", 14]]
let deck = {}
for (let i = 0; i < values.length; i++) {
   for (let j = 0; j < suits.length; j++) {
      deck[`${values[i][0]} of ${suits[j]}`] = values[i][1]
   }
}  





class Deck extends React.Component {
   

   render() {
      return (
         <div>
            <ul>
               {Object.keys(deck).map((k) => (
                  <div>
                     <p>{k}</p>
                     <p>{deck[k]}</p>
                  </div>
                  )
               )}
            </ul>            
         </div>
      )
   }
}

// x = new Deck();
// console.log(x);

export default Deck;




