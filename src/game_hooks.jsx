import React, {useState} from 'react';
// import Deck from './deck';
import { connect } from 'react-redux'


const GameHooks = (props) => { 
   const [deck, setDeck] = useState([]);
   const [player1_hand, setPlayer1_hand] = useState([]);
   const [player2_hand, setPlayer2_hand] = useState([]);
   const [cards_to_be_won, setCards_to_be_won] = useState([]);
   const [play, setPlay] = useState(false);
   const [speed, setSpeed] = useState(1000);
   const [game_on, setGame_on] = useState(false);    

   

   const dealCards = () => {   
      if (player1_hand.length === 0 && player2_hand.length === 0){
         
         // Create a new deck
         let suits = ["Hearts", "Clubs", "Diamonds", "Spades"]
         let values = [["Two", 2], ["Three", 3], ["Four", 4], ["Five", 5], ["Six", 6], ["Seven", 7], ["Eight", 8], ["Nine", 9], ["Ten", 10], ["Jack", 11], ["Queen", 12], ["King", 13], ["Ace", 14]]
         for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < suits.length; j++) {
               setDeck((d) => [...d, [`${values[i][0]} of ${suits[j]}`, values[i][1]]])
            }
         }  
         console.log('deck created within dealcards()');
         console.log('deck',deck);


         // Deal the cards from the deck to both players
         let i = 0; 
         //continue dealing as long as there are still cards in the deck  
         
         while (deck.length > 0){ 
            //find a random card in the deck
            let random_card = Math.floor(Math.random()*deck.length);
            if (i%2 === 0){ // deal to player 1 if i is even
               // temp_player1_hand.push(temp_deck.splice(random_card, 1)[0])
               setPlayer1_hand((hand1) => [...hand1, deck.splice(random_card, 1)[0]])
            } else {       // deal to player 2 if i is uneven
               // temp_player2_hand.push(temp_deck.splice(random_card, 1)[0])
               setPlayer2_hand((hand2) => [...hand2, deck.splice(random_card, 1)[0]])

            }            
            i++;
         }
         
         console.log('dealCards1()');
         console.log('player1_hand',player1_hand);
         console.log('player2_hand',player2_hand);
         console.log('deck',deck);
      }   
      console.log('dealCards2()');

   }

   const check_winner = () => {
      if (player1_hand.length === 0){
         console.log('Player 2 won the game');
         alert('Player 2 won the game');
         setGame_on(false);
         // Increment winner's tally in Database
         reset();     
         return    
      } else if (player2_hand.length === 0){
         console.log('Player 2 won the game');
         alert('Player 1 won the game');
         setGame_on(false);
         // Increment winner's tally in Database
         reset();    
         return     
      }
      console.log('check_winner()');
   }

   const playcards = () => {
      check_winner();
      console.log('p1',player1_hand[0]);
      console.log('p2',player2_hand[0]);
      console.log('cards_to_be_won', cards_to_be_won);
      if (game_on){
         if (player1_hand[0][1] > player2_hand[0][1]){
            console.log('player1 wins');
            setPlayer1_hand([...player1_hand, player2_hand.splice(0, 1)[0], player1_hand.splice(0, 1)[0] ])

            while (cards_to_be_won.length > 0){
               setPlayer1_hand([...player1_hand, cards_to_be_won.splice(0, 1)[0] ])
            }
         } else if (player1_hand[0][1] < player2_hand[0][1]){
            console.log('player2 wins');
            setPlayer2_hand([...player2_hand, player2_hand.splice(0, 1)[0], player1_hand.splice(0, 1)[0] ])
            
            while (cards_to_be_won.length > 0){
               setPlayer2_hand([...player2_hand, cards_to_be_won.splice(0, 1)[0] ])
            }
         } else {
            console.log('war');
            if (player1_hand.length < 3){
               console.log('Player 2 won the game');
               alert('Player 2 won the game');
               setGame_on(false);
               // Increment winner's tally in Database
               reset();     
                  
            } else if (player2_hand.length < 3){
               console.log('Player 2 won the game');
               alert('Player 1 won the game');
               setGame_on(false);
               // Increment winner's tally in Database
               reset();    
                   
            } else {
               cards_to_be_won.push(player1_hand.splice(0, 1)[0])      
               cards_to_be_won.push(player2_hand.splice(0, 1)[0])       
               cards_to_be_won.push(player1_hand.splice(0, 1)[0])         
               cards_to_be_won.push(player2_hand.splice(0, 1)[0])      
   
               playcards()
            }
         }
      }
      console.log('player1_hand',player1_hand);
      console.log('player2_hand',player2_hand);
     
   }

   const play_game = () => {
      setGame_on(true);
      while (game_on){
         reset();
         dealCards();
         playcards();
      }
   }


   const reset = () => {
      setGame_on(false);
      setDeck([]);
      setPlayer1_hand([]);
      setPlayer2_hand([]);
   }




   
   console.log('deck',deck);
   console.log('player1_hand',player1_hand);
   console.log('player2_hand',player2_hand);
   return(
      <div>
         <button onClick={reset}>Reset</button>
         <button onClick={dealCards}>dealCards</button>
         <button onClick={playcards}>playcards</button>
         <button onClick={play_game}>play game!!</button>
         {/* <Deck/> */}  
         <h1>{`Deck: ${deck.length}`}</h1>       
         <h1>{`Player1 has ${player1_hand.length} cards`}</h1>       
         <h1>{`Player2 has ${player2_hand.length} cards`}</h1>       
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


const mSTP = state => ({
   deck: state.deck
})



export default connect(mSTP)(GameHooks);