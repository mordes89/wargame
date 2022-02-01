

class Deck extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         suits: ["Hearts", "Clubs", "Diamonds", "Spades"],
         values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"],
         deck: []
      }

      for (let i = 0; i < this.values.length; i++) {
         for (let i = 0; i < this.values.length; i++) {
            this.deck.push(this.values[i]);
         }
      }
   }
}