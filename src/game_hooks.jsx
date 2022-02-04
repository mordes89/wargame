import React, {useState, useEffect, useRef} from 'react';
// import Deck from './deck';
import { connect } from 'react-redux'


const GameHooks = () => { 
   const [deck, setDeck] = useState([]);
   const [player1_hand, setPlayer1_hand] = useState([]);
   const [player2_hand, setPlayer2_hand] = useState([]);
   const [cards_to_be_won, setCards_to_be_won] = useState([]);
   const [play, setPlay] = useState(false);
   const [speed, setSpeed] = useState(2000);
   const [game_on, setGame_on] = useState(false);
   const [player1_wins, setPlayer1_wins] = useState(0);
   const [player2_wins, setPlayer2_wins] = useState(0);

   const deckRef = useRef([]);
   const player1_handRef = useRef([]);
   const player2_handRef = useRef([]);
   const cards_to_be_wonRef = useRef([]);
   
   deckRef.current = deck;
   player1_handRef.current = player1_hand;
   player2_handRef.current = player2_hand;
   cards_to_be_wonRef.current = cards_to_be_won;
   
   // useEffect(() => {
   //    console.log('useEffect');
   //    // setDeck2([deck])
   //    // console.log('deck2',deck2);
   // },[deck])


   const createDeck = new Promise((res, rej) => {
      // Create a new deck
      if (deck.length < 52 && player1_hand.length === 0 && player2_hand.length === 0){
         let suits = ["Hearts", "Clubs", "Diamonds", "Spades"]
         let values = [["Two", 2], ["Three", 3], ["Four", 4], ["Five", 5], ["Six", 6], ["Seven", 7], ["Eight", 8], ["Nine", 9], ["Ten", 10], ["Jack", 11], ["Queen", 12], ["King", 13], ["Ace", 14]]
         for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < suits.length; j++) {
               setDeck((d) => [...d, [`${values[i][0]} of ${suits[j]}`, values[i][1]]])
            }
         }  
         console.log('deck created within dealcards()');
         console.log('deck',deck);
         if (deck.length === 52){
            res(deck)
         }
      }
      
   })
  
   

   const dealCards = () => {   
      if (player1_hand.length === 0 && player2_hand.length === 0){
         
         // Deal the cards from the deck to both players
         //continue dealing as long as there are still cards in the deck
         //setTimeout(() => {
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
         //}, speed) 
      }   
      // console.log('player1_hand',player1_hand);
      // console.log('player2_hand',player2_hand);
      // console.log('deck',deck);
      // res(player1_hand, player2_hand)
   }//)



   const check_winner = (n) => {
      if (player1_handRef.current.length < n){
         console.log('Player 2 won the game');
         alert('Player 2 won the game');
         setGame_on(false);
         // Increment winner's tally in Database
         setPlayer2_wins((prev) => prev+1)
         reset();     
         console.log('player1_hand',player1_hand);
         console.log('player2_hand',player2_hand);
         return    
      } else if (player2_handRef.current.length < n){
         console.log('Player 1 won the game');
         alert('Player 1 won the game');
         setGame_on(false);
         // Increment winner's tally in Database
         setPlayer1_wins((prev) => prev+1)
         reset();   
         console.log('player1_hand',player1_hand);
         console.log('player2_hand',player2_hand); 
         return     
      }
      setGame_on(()=>true)
      console.log('check_winner()');
   }

   const playcards = () => {
      // check_winner(1);
      // console.log('p1',player1_hand[0]);
      // console.log('p2',player2_hand[0]);
      // console.log('cards_to_be_won', cards_to_be_won);
      if (player1_handRef.current.length + player2_handRef.current.length === 52){
         if (player1_handRef.current[0][1] > player2_handRef.current[0][1]){
            console.log('player1 wins');

            let card1 = player1_hand.splice(0, 1)[0];
            let card2 = player2_hand.splice(0, 1)[0];
             
            setPlayer2_hand((oldHand2)=> player2_hand)
            setPlayer1_hand((oldHand1)=> [...player1_hand, card1, card2])

            while (cards_to_be_wonRef.current.length > 0){
               let card = cards_to_be_won.splice(0, 1)[0];
               setCards_to_be_won((oldCTBW)=> cards_to_be_won)
               setPlayer1_hand((oldHand1) => [...oldHand1, card])
            }
         } else if (player1_handRef.current[0][1] < player2_handRef.current[0][1]){
            console.log('player1_handRef.current', player1_handRef.current);
            console.log('player2_handRef.current', player2_handRef.current);
            console.log('player2 wins');

            let card1 = player1_hand.splice(0, 1)[0];
            let card2 = player2_hand.splice(0, 1)[0];
             
            setPlayer1_hand((oldHand1)=> player1_hand)
            setPlayer2_hand((oldHand2)=> [...player2_hand, card1, card2])
            
            while (cards_to_be_wonRef.current.length > 0){
               let card = cards_to_be_won.splice(0, 1)[0];
               setCards_to_be_won((oldCTBW)=> cards_to_be_won)
               setPlayer2_hand((oldHand2) => [...oldHand2, card])
            }
         } else {
            console.log('war');
            if (!check_winner(3)){
               for(let i = 0; i < 2; i++){
                  let card1 = player1_hand.splice(0, 1)[0];
                  let card2 = player2_hand.splice(0, 1)[0];               
                  
                  setPlayer1_hand((h1)=> player1_hand)
                  setPlayer2_hand((h2)=> player2_hand)
      
                  setCards_to_be_won((oldCTBW) => [...oldCTBW, card1, card2])               
               }
               playcards();
            }            
         }
      }
      // console.log('playCards');
      // console.log('player1_hand',player1_hand);
      // console.log('player2_hand',player2_hand);
     
   }


   const reset = () => {
      // setGame_on(false);
      // setDeck([]);
      setPlayer1_hand([]);
      setPlayer2_hand([]);
      setCards_to_be_won([]);
   }


   const play_game = () => {
      console.log('play game');
      // setGame_on(true);
      // reset();
      // dealCards()
      // await createDeck();
      // dealCards();
      let i = 0;
      while (i < 10){
         // setTimeout(() => {
            check_winner(1);
            playcards();
            i++;
         // }, 1)
      }
   }
   
   // console.log('deck',deck);
   console.log('player1_hand',player1_hand);
   console.log('player2_hand',player2_hand);
   console.log('cards_to_be_won',cards_to_be_won);
   return(
      <div>
         <button onClick={reset}>Reset</button>
         {/* <button onClick={createDeck}>createDeck</button> */}
         <button onClick={dealCards}>dealCards</button>
         <button onClick={playcards}>playcards</button>
         <button onClick={play_game}>play game!!</button>
         {/* <Deck/> */}  
         <h3>{`Deck: ${deck.length}`}</h3>       
         <h3>{`Player1 has won ${player1_wins} games`}</h3>       
         <h3>{`Player2 has won ${player2_wins} games`}</h3>       
         <h3>{`Player1 has ${player1_hand.length} cards`}</h3>       
         <h3>{`Player2 has ${player2_hand.length} cards`}</h3>       
         <h1>{player1_hand.length > 0 ? `Player1 plays: ${player1_hand[0][0]}` : null}</h1>       
         <h1>{player2_hand.length > 0 ? `Player2 plays: ${player2_hand[0][0]}` : null}</h1>       
         <p>{JSON.stringify(deck)}</p>          
         <p>{JSON.stringify(player1_hand)}</p>          
         <p>{JSON.stringify(player2_hand)}</p>          
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

export default GameHooks;