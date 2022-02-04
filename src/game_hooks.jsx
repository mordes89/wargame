import React, {useState, useEffect, useRef} from 'react';
// import Deck from './deck';
import { connect } from 'react-redux'


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
            let values = [["Two", 2], ["Three", 3], ["Four", 4], ["Five", 5], ["Six", 6], ["Seven", 7], ["Eight", 8], ["Nine", 9], ["Ten", 10], ["Jack", 11], ["Queen", 12], ["King", 13], ["Ace", 14]];
            for (let i = 0; i < values.length; i++) {
               for (let j = 0; j < suits.length; j++) {
                  setDeck((d) => [...d, [`${values[i][0]} of ${suits[j]}`, values[i][1]]]);
               }
            }
      }
   }
  
   

   const dealCards = () => {   
      if (player1_hand.length === 0 && player2_hand.length === 0){        
        
         for (let i = 0; i<52; i++){ 
            //find the index of a random card in the deck
            let random_card = Math.floor(Math.random()*deckRef.current.length);
            
            if (i%2 === 0){               // deal to player 1 if i is even
               let card1 = deckRef.current[random_card]
               deck.splice(random_card, 1)               
               setDeck((d)=> deck)
               setPlayer1_hand((hand1) => [...hand1, card1])
            } else if (i%2 === 1){       // deal to player 2 if i is uneven
               let card2 = deckRef.current[random_card]
               deck.splice(random_card, 1)
               setDeck((d)=> deck)
               setPlayer2_hand((hand2) => [...hand2, card2])
            }            
         }   
      }   
      
   }

   const setNumHandsToBePlayed = (action) => {    
      if (action === '+'){
         setNum_of_hands(num_of_handsRef.current+5)
      } else if (num_of_handsRef.current > 50){
         setNum_of_hands(num_of_handsRef.current-5)
      }     
   }

   const adjustSpeed = (action) => {    
      if (action === 'Slower'){
         setSpeed(speedRef.current+10)
      } else if (speedRef.current > 11){
         setSpeed(speedRef.current-10)
      }     
   }



   const check_winner = (n) => {
      if (player1_handRef.current.length < n){
         // console.log('Player 2 won the game');
         setGame_on(false);
         // Increment winner's tally in Database
         setPlayer2_wins((prev) => prev+1)                
         reset();     
         alert('Player 2 won the game');
         return true
      } else if (player2_handRef.current.length < n){
         console.log('Player 1 won the game');
         setGame_on(false);
         // Increment winner's tally in Database
         setPlayer1_wins((prev) => prev+1)         
         reset();   
         alert('Player 1 won the game');
         return true  
      }
      setGame_on(true)
      return false
   }

   const playcards = async () => {
      if (game_onRef.current){
         
         if (player1_handRef.current[0][1] > player2_handRef.current[0][1]){
            setWar(false);
            console.log('player1 wins');

            let card1 = player1_handRef.current.splice(0, 1)[0];
            let card2 = player2_handRef.current.splice(0, 1)[0];
            await sleep(speedRef.current)

            setPlayer2_hand((oldHand2)=> player2_handRef.current)
            setPlayer1_hand((oldHand1)=> [...player1_handRef.current, card1, card2])
            // setPlayer1_hand((oldHand1)=> [...player1_handRef.current, card2])
            while (cards_to_be_wonRef.current.length > 0){
               let card = cards_to_be_wonRef.current.splice(0, 1)[0];
               setCards_to_be_won((oldCTBW) => cards_to_be_wonRef.current)
               if (!player1_handRef.current.includes(card)){
                  setPlayer1_hand((oldHand1) => [...player1_handRef.current, card])
               }
            }
            setGame_on(true);
         } else if (player1_handRef.current[0][1] < player2_handRef.current[0][1]){
            
            setWar(false);
            console.log('player2 wins');

            let card1 = player2_handRef.current.splice(0, 1)[0];
            let card2 = player1_handRef.current.splice(0, 1)[0];
            await sleep(speedRef.current)

            setPlayer1_hand((oldHand1)=> player1_handRef.current)
            setPlayer2_hand((oldHand2)=> [...player2_handRef.current, card1, card2])
            // setPlayer2_hand((oldHand2)=> [...player2_handRef.current, card2])
            while (cards_to_be_wonRef.current.length > 0){
               let card = cards_to_be_wonRef.current.splice(0, 1)[0];
               setCards_to_be_won((oldCTBW) => cards_to_be_wonRef.current)
               if (!player2_handRef.current.includes(card)){
                  setPlayer2_hand((oldHand2) => [...player2_handRef.current, card])
               }
            }
            setGame_on(true);
         } else {
            console.log('war!');
            setWar(true)
            if (warRef.current && !check_winner(3)){
               // for(let i = 0; i < 2; i++){
                  let [card1, card2] = player1_handRef.current.splice(0, 2);
                  let [card3, card4] = player2_handRef.current.splice(0, 2);
                  // let card2 = player2_handRef.current.splice(0, 1)[0];               
                  await sleep(speedRef.current)

                  setPlayer1_hand((h1)=> player1_handRef.current)
                  setPlayer2_hand((h2)=> player2_handRef.current)
                  await sleep(speedRef.current)
                  if (!cards_to_be_wonRef.current.includes(card1)){
                     setCards_to_be_won((oldCTBW) => [...cards_to_be_wonRef.current, card1, card2, card3, card4])               
                  }
               // }
               setGame_on(true);
               await sleep(speedRef.current)
               playcards();    
            }            
         }         

      }
      
   }

   

   const reset = () => {
      // setGame_on(false);
      // setDeck([]);
      setPlayer1_hand([]);
      setPlayer2_hand([]);
      setCards_to_be_won([]);
   }


   const play_game = async () => {
      game_onRef.current = true
      let i = 0;
      while (i < num_of_handsRef.current && game_onRef.current){
         await sleep(speedRef.current)
         check_winner(1);
         playcards();
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