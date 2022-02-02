import React from 'react';
// import Deck from './deck';
import { connect } from 'react-redux'


class Game extends React.Component {   
   constructor(props) {
      super(props);
      this.state = {
         deck: [],
         player1_hand: [],
         player2_hand: [],
         player1_cards_played: [],
         player2_cards_played: [],
         cards_to_be_won: [],
         play: false,
         speed: 1000,
         game_on: false,
      }

      this.dealCards = this.dealCards.bind(this);
      this.playcards = this.playcards.bind(this);
      this.reset = this.reset.bind(this);
      this.check_winner = this.check_winner.bind(this);
      this.play = this.play.bind(this);
   }

   


   dealCards(){   
      if (this.state.player1_hand.length === 0 && this.state.player2_hand.length === 0){
         
         // Create a new deck
         let suits = ["Hearts", "Clubs", "Diamonds", "Spades"]
         let values = [["Two", 2], ["Three", 3], ["Four", 4], ["Five", 5], ["Six", 6], ["Seven", 7], ["Eight", 8], ["Nine", 9], ["Ten", 10], ["Jack", 11], ["Queen", 12], ["King", 13], ["Ace", 14]]

         for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < suits.length; j++) {
               this.setState({ deck: [...this.state.deck, [`${values[i][0]} of ${suits[j]}`, values[i][1]] ]})
               // this.state.deck.push([`${values[i][0]} of ${suits[j]}`, values[i][1]])      
            }
         }  
         console.log('deck created within dealcards()');
         console.log('deck',this.state.deck);


         // Deal the cards from the deck to both players
         let i = 0; 
         //continue dealing as long as there are still cards in the deck  
         while (this.state.deck.length > 0){ 
            //find a random card in the deck
            let random_card = Math.floor(Math.random()*this.state.deck.length);
   
            if (i%2 === 0){ // deal to player 1
               this.setState({ player1_hand: [...this.state.player1_hand, this.state.deck.splice(random_card, 1)]})
            } else {       // deal to player 2
               this.setState({ player2_hand: [...this.state.player2_hand, this.state.deck.splice(random_card, 1)]})
            }
            // Once card is dealt, delete said card from deck
            // this.state.deck.splice(random_card, 1)
            i++;
         }
         console.log('dealCards1()');
         console.log('player1_hand',this.state.player1_hand);
         console.log('player2_hand',this.state.player2_hand);
         console.log('deck',this.state.deck);
      }   
      console.log('dealCards2()');

   }

   check_winner(){
      if (this.state.player1_hand.length === 0){
         console.log('Player 2 won the game');
         alert('Player 2 won the game');
         this.setState({ game_on: false });
         // Increment winner's tally in Database
         this.reset();     
         return    
      } else if (this.state.player2_hand.length === 0){
         console.log('Player 2 won the game');
         alert('Player 1 won the game');
         this.setState({ game_on: false });
         // Increment winner's tally in Database
         this.reset();    
         return     
      }
      console.log('check_winner()');
   }

   playcards(){
      this.check_winner();
      console.log('p1',this.state.player1_hand[0]);
      console.log('p2',this.state.player2_hand[0]);
      console.log('cards_to_be_won', this.state.cards_to_be_won);
      if (this.state.game_on){
         if (this.state.player1_hand[0][1] > this.state.player2_hand[0][1]){
            console.log('player1 wins');
            this.state.player1_hand.push(this.state.player2_hand.splice(0, 1)[0])         
            this.state.player1_hand.push(this.state.player1_hand.splice(0, 1)[0])

            while (this.state.cards_to_be_won.length > 0){
               this.state.player1_hand.push(this.state.cards_to_be_won.splice(0, 1)[0])            
            }
         } else if (this.state.player1_hand[0][1] < this.state.player2_hand[0][1]){
            console.log('player2 wins');
            this.state.player2_hand.push(this.state.player1_hand.splice(0, 1)[0])         
            this.state.player2_hand.push(this.state.player2_hand.splice(0, 1)[0])
            
            while (this.state.cards_to_be_won.length > 0){
               this.state.player2_hand.push(this.state.cards_to_be_won.splice(0, 1)[0])            
            }
         } else {
            console.log('war');
            if (this.state.player1_hand.length < 3){
               console.log('Player 2 won the game');
               alert('Player 2 won the game');
               this.setState({ game_on: false });
               // Increment winner's tally in Database
               this.reset();     
                  
            } else if (this.state.player2_hand.length < 3){
               console.log('Player 2 won the game');
               alert('Player 1 won the game');
               this.setState({ game_on: false });
               // Increment winner's tally in Database
               this.reset();    
                   
            } else {
               this.state.cards_to_be_won.push(this.state.player1_hand.splice(0, 1)[0])      
               this.state.cards_to_be_won.push(this.state.player2_hand.splice(0, 1)[0])       
               this.state.cards_to_be_won.push(this.state.player1_hand.splice(0, 1)[0])         
               this.state.cards_to_be_won.push(this.state.player2_hand.splice(0, 1)[0])      
   
               this.playcards()
            }
         }
      }
      console.log('player1_hand',this.state.player1_hand);
      console.log('player2_hand',this.state.player2_hand);
     
   }

   play(){
      this.setState({ game_on: true })
      while (this.state.game_on){
         this.reset();
         this.dealCards();
         this.playcards();
      }
   }


   reset(){
      this.setState({ deck: [] });
      this.setState({ player1_hand: [] });
      this.setState({ player2_hand: [] });
   }




   render(){
      console.log('deck',this.state.deck);
      console.log('player1_hand',this.state.player1_hand);
      console.log('player2_hand',this.state.player2_hand);
      return(
         <div>
            <button onClick={this.reset}>Reset</button>
            <button onClick={this.dealCards}>dealCards</button>
            <button onClick={this.playcards}>playcards</button>
            <button onClick={this.play}>play!!</button>
            {/* <Deck/> */}  
            <h1>{`Deck: ${this.state.deck.length}`}</h1>       
            <h1>{`Player1 has ${this.state.player1_hand.length} cards`}</h1>       
            <h1>{`Player2 has ${this.state.player2_hand.length} cards`}</h1>       
            <h1>{this.state.player1_cards_played.length > 0 ? `Player1 plays: ${this.state.player1_cards_played[0][0]}` : null}</h1>       
            <h1>{this.state.player2_cards_played.length > 0 ? `Player2 plays: ${this.state.player2_cards_played[0][0]}` : null}</h1>       
            <ul>
               {this.state.deck.map((k) => (
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


const mSTP = state => ({
   deck: state.deck
})



export default connect(mSTP)(Game);