import React, {useState, useEffect, useRef} from 'react';
// import Deck from './deck';


const GameHooks = () => { 
   const [deck, setDeck] = useState([]);
   const [player1_hand, setPlayer1_hand] = useState([]);
   const [player2_hand, setPlayer2_hand] = useState([]);
   const [cards_to_be_won, setCards_to_be_won] = useState([]);
   const [game_on, setGame_on] = useState(false);
   const [war, setWar] = useState(false);
   const [player1_wins, setPlayer1_wins] = useState(0);
   const [player2_wins, setPlayer2_wins] = useState(0);
   const [num_of_hands, setNum_of_hands] = useState(400);
   const [speed, setSpeed] = useState(30);

   // Using useRef hook to keep track of the current values 
   // of variables when referencing them within functions.
   const deckRef = useRef([]);
   const game_onRef = useRef(false);
   const warRef = useRef(false);
   const player1_handRef = useRef([]);
   const player2_handRef = useRef([]);
   const cards_to_be_wonRef = useRef([]);
   const num_of_handsRef = useRef(400);
   const speedRef = useRef(30);
   
   deckRef.current = deck;
   game_onRef.current = game_on;
   warRef.current = war;
   player1_handRef.current = player1_hand;
   player2_handRef.current = player2_hand;
   cards_to_be_wonRef.current = cards_to_be_won;
   num_of_handsRef.current = num_of_hands;
   speedRef.current = speed;

   const sleep = (time) => {
      return new Promise((resolve) => {
         setTimeout(resolve, time)
      })
    };


   // Function that creates the deck:
   const createDeck = () => {
         if (deck.length < 52 && player1_hand.length === 0 && player2_hand.length === 0) {
            let suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
            let values = [["Two", 2], ["Three", 3], ["Four", 4], ["Five", 5], ["Six", 6], 
                           ["Seven", 7], ["Eight", 8], ["Nine", 9], ["Ten", 10], ["Jack", 11], 
                           ["Queen", 12], ["King", 13], ["Ace", 14]];
            
            // Iterate through 'suits' array, within each suit, we iterate through 
            // all the 'values' in a nested loop that creates 13 cards for each suit
            for (let i = 0; i < values.length; i++) {
               for (let j = 0; j < suits.length; j++) {
                  setDeck((d) => [...d, [`${values[i][0]} of ${suits[j]}`, values[i][1]]]);
               }
            }
      }
   }
  
   
   // Function that deals the cards to both players before the game begins
   const dealCards = () => {   
      if (player1_hand.length === 0 && player2_hand.length === 0){        
        
         for (let i = 0; i<52; i++){ 
            //find the index of a random card in the deck
            let random_card = Math.floor(Math.random()*deckRef.current.length);
            
            if (i%2 === 0){               // deal to player 1 if i is even
               
               // save the value of the card that will be removed from the deck
               let card1 = deckRef.current[random_card]
               // Remove the card from the deck
               deck.splice(random_card, 1) 
               // Set the deck to it's current state without the removed card              
               setDeck((d)=> deck)
               // Add the saved card to the player's hand
               setPlayer1_hand((hand1) => [...hand1, card1])

               // Same cycle comes up a lot in this code!

            } else if (i%2 === 1){       // deal to player 2 if i is uneven
               // Same cycle as above
               let card2 = deckRef.current[random_card]
               deck.splice(random_card, 1)
               setDeck((d)=> deck)
               setPlayer2_hand((hand2) => [...hand2, card2])
            }            
         }   
      }   
      
   }


   // Function that increments or decrements the number of hands the user would like to play
   const setNumHandsToBePlayed = (action) => {    
      if (action === '+'){
         setNum_of_hands(num_of_handsRef.current+5)
      } else if (num_of_handsRef.current > 50){
         setNum_of_hands(num_of_handsRef.current-5)
      }     
   }


   // Function that increments or decrements the speed at which the hands are automatically played
   const adjustSpeed = (action) => {    
      if (action === 'Slower'){
         setSpeed(speedRef.current+10)
      } else if (speedRef.current > 11){
         setSpeed(speedRef.current-10)
      }     
   }


   // This function checks if a player ran out of cards. i.e the other player wins.
   const check_winner = (n) => {
      // if player 1 has less than n (could be 1 or 2, if there is a war), then player2 wins
      if (player1_handRef.current.length < n){
         console.log('Player 2 won the game');
         setGame_on(false);
         // Increment winner's tally in Database
         setPlayer2_wins((prev) => prev+1)                
         alert('Player 2 won the game');
         reset();     
         return true
      } else if (player2_handRef.current.length < n){
         console.log('Player 1 won the game');
         setGame_on(false);
         // Increment winner's tally in Database
         setPlayer1_wins((prev) => prev+1)         
         alert('Player 1 won the game');
         reset();   
         return true  
      } else {
         setGame_on(true);
         return false;
      }
      
   }

   // The main function of the game
   const playcards = async () => {
      if (game_onRef.current){
         // Check if player 1's top card is bigger than player 2's top card, and that noone has won yet
         if ((player1_handRef.current[0][1] > player2_handRef.current[0][1]) && !check_winner(1)){
            setWar(false);
            console.log('player1 wins');

            // same cycle as above in dealing the cards
            // save the values of the cards that are removed from the hands
            let card1 = player1_handRef.current.splice(0, 1)[0];
            let card2 = player2_handRef.current.splice(0, 1)[0];
            await sleep(speedRef.current)
            // Set the losing hand to it's current state without the removed card
            setPlayer2_hand((oldHand2)=> player2_handRef.current)
            // Add both removed cards to the winning hand
            setPlayer1_hand((oldHand1)=> [...player1_handRef.current, card1, card2])

            // We need to add all the cards in the 'escrow' array where we keep the 
            // cards to be won if there is a war. While there are cards to be won in war,
            // this loop adds those cards to the winning plater's hand
            while (cards_to_be_wonRef.current.length > 0){
               let card = cards_to_be_wonRef.current.splice(0, 1)[0];
               setCards_to_be_won((oldCTBW) => cards_to_be_wonRef.current)
               if (!player1_handRef.current.includes(card)){
                  setPlayer1_hand((oldHand1) => [...player1_handRef.current, card])
               }
            }
            setGame_on(true);

         } else if ((player1_handRef.current[0][1] < player2_handRef.current[0][1]) && !check_winner(1)){
            setWar(false);
            console.log('player2 wins');

            let card1 = player2_handRef.current.splice(0, 1)[0];
            let card2 = player1_handRef.current.splice(0, 1)[0];
            await sleep(speedRef.current)

            setPlayer1_hand((oldHand1)=> player1_handRef.current)
            setPlayer2_hand((oldHand2)=> [...player2_handRef.current, card1, card2])

            while (cards_to_be_wonRef.current.length > 0){
               let card = cards_to_be_wonRef.current.splice(0, 1)[0];
               setCards_to_be_won((oldCTBW) => cards_to_be_wonRef.current)
               if (!player2_handRef.current.includes(card)){
                  setPlayer2_hand((oldHand2) => [...player2_handRef.current, card])
               }
            }
            setGame_on(true);


            // If neither player wins the round, we are at war!!
         } else if ((player1_handRef.current[0][1] === player2_handRef.current[0][1]) && !check_winner(1)){
            console.log('war!');
            setWar(true)

            // Check if both players have enough cards to play the war. If not, there is a winner! 
            if (warRef.current && !check_winner(2)){
               // Pull two cards from each player and save the values
               let [card1, card2] = player1_handRef.current.splice(0, 2);
               let [card3, card4] = player2_handRef.current.splice(0, 2);
               await sleep(speedRef.current)

               // Set the player's hands with their new state without removed cards
               setPlayer1_hand((h1)=> player1_handRef.current)
               setPlayer2_hand((h2)=> player2_handRef.current)
               await sleep(speedRef.current)

               if (!cards_to_be_wonRef.current.includes(card1)){
                  // Add removed cards to the 'escrow' deck for the winner of the war.
                  setCards_to_be_won((oldCTBW) => [...cards_to_be_wonRef.current, card1, card2, card3, card4])               
               }
               setGame_on(true);
               await sleep(speedRef.current)

               // Once cards in war are removed, we play again and the winner takes the cards in 'escrow' (i.e. cards_to_be_won)
               playcards();    
            }            
         }         

      }
      
   }

   
   // Once game is complete, reset the game
   const reset = () => {
      setGame_on(false);
      setPlayer1_hand([]);
      setPlayer2_hand([]);
      setCards_to_be_won([]);
   }

   // Function that allows the user to play the game
   const play_game = async () => {
      game_onRef.current = true
      let i = 0;
      
      // while i is smaller than the number of hands the user wants to play, play the game!
      while (i < num_of_handsRef.current && game_onRef.current){
         playcards();
         await sleep(speedRef.current)         
         check_winner(1)
         i++;
      }
   }
   
   
   
   return(
      <div>
         <div id='scores'>
            <h4>{`Player 1 has won ${player1_wins} games`}</h4>       
            <h4 id="p2">{`Player 2 has won ${player2_wins} games`}</h4> 
         </div>      
         {/* <button onClick={reset}>Reset</button> */}
         <div id='scores'>
            <button 
               disabled={(deckRef.current.length > 0 || 
                           player1_handRef.current.length > 0 || 
                           player2_handRef.current.length > 0) ? 
                           true : false} 
               onClick={createDeck}>
                  Create Deck
            </button>
            <button 
               disabled={deckRef.current.length <= 0 ? 
                           true : false} 
               onClick={dealCards}>
                  Deal Cards
            </button>  
         </div>

         <h3 id="center">{`Deck has ${deck.length} cards`}</h3> 
              
         <div id='center'>
            <button 
               disabled={(player1_handRef.current.length <= 0 || 
                           player2_handRef.current.length <= 0) ? 
                           true : false} 
               onClick={()=>setNumHandsToBePlayed('-')}>
                  -
            </button>
            <button 
               disabled={(player1_handRef.current.length <= 0 || 
                           player2_handRef.current.length <= 0) ? 
                           true : false} 
               onClick={play_game}>
                  {`Play ${num_of_handsRef.current} Hands`}
            </button>
            <button 
               disabled={(player1_handRef.current.length <= 0 || 
                           player2_handRef.current.length <= 0) ? 
                           true : false} 
               onClick={()=>setNumHandsToBePlayed('+')}>
                  +
            </button>
         </div>      

         <div id='center'>
            <button 
               disabled={(player1_handRef.current.length <= 0 || 
                           player2_handRef.current.length <= 0) ? 
                           true : false} 
               onClick={()=>adjustSpeed('Slower')}>
                  Slower
            </button>         
            <button 
               disabled={(player1_handRef.current.length <= 0 || 
                           player2_handRef.current.length <= 0) ? 
                           true : false} 
               onClick={()=>adjustSpeed('Faster')}>
                  Faster
            </button>
            {/* <Deck/> */}  
         </div> 
         <div id='center'>     
            <h3>{`Player 1 has ${player1_hand.length} cards`}</h3>       
            <h3 id="p2">{`Player 2 has ${player2_hand.length} cards`}</h3>
         </div> 

         <div id='scores'>
            <div id='hand'>
               <h1>Player 1's Hand:</h1>        
               <ul>
                  {player1_handRef.current.map((k) => (
                     <h4 key={`player1-${k}`}>
                        {k[0]}
                     </h4>
                     )
                  )}
               </ul>  
            </div>  
            <div id='hand' id="p2">
               <h1>Player 2's Hand:</h1> 
               <ul>
                  {player2_handRef.current.map((k) => (
                     <h4 key={`player2-${k}`}>
                        {k[0]}
                     </h4>
                     )
                  )}
               </ul> 
            </div>  
         </div>  
      </div>
   )

}

export default GameHooks;