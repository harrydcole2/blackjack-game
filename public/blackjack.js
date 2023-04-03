class Deck {
  deck = [];

  constructor(){
    this.createDeck();
    this.shuffleDeck();
  }
  createDeck() {
    let suits = ["\u2665", "\u2666", "\u2663", "\u2660"];
    let ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < ranks.length; j++) {
        let card = {
          suit: suits[i],
          rank: ranks[j],
          value: values[j]
        };
        this.deck.push(card);
      }
    }
  }
  
  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }
}

class Game {
  deck;
  dealerHand = [];
  playerHand = [];
  topOfDeck = 5;
  ifStand = false;
  balance;
  bet;
  badBet;

  constructor() {
    this.deck = new Deck();
    this.setUsername();
    this.getBalance();
    this.getBet();
  }

  play(){
    this.dealCards();
    this.outputHands();
  }

  restart(){
    if(this.ifStand){
      this.deck = new Deck();
      this.clearHand();
      this.ifStand = false;
      this.bet = null;
      this.topOfDeck = 5;
      this.getBet();
    }
  }

  dealCards() {
    this.dealerHand = [this.deck.deck[0], this.deck.deck[2]];
    this.playerHand = [this.deck.deck[1], this.deck.deck[3]];
  }

  outputHands(){
    let firstCard = document.createTextNode("?");
    let card = document.getElementById("dealerFirstCard");
    card.appendChild(firstCard);
    let secondCard = document.createTextNode(this.dealerHand[1].rank + this.dealerHand[1].suit);
    card = document.getElementById("dealerSecondCard");
    card.appendChild(secondCard);
    firstCard = document.createTextNode(this.playerHand[0].rank + this.playerHand[0].suit);
    card = document.getElementById("playerFirstCard");
    card.appendChild(firstCard);
    firstCard = document.createTextNode(this.playerHand[1].rank + this.playerHand[1].suit);
    card = document.getElementById("playerSecondCard");
    card.appendChild(firstCard);
    if(this.playerTotal() === 21){
      this.stand();
    }
  }
  
  checkAce(hand){
    for(let i = 0; i < hand.length; i++){
      if(hand[i].value === 11){
        hand[i].value = 1;
        return false;
      }
    }
    return true;
  }
  
  playerTotal(){
    let temp = 0;
    for(let i = 0; i < this.playerHand.length; i++){
      temp += this.playerHand[i].value;
    }
    return temp;
  }
  
  dealerTotal(){
    let temp = 0;
    for(let i = 0; i < this.dealerHand.length; i++){
      temp += this.dealerHand[i].value;
    }
    return temp;
  }
  
  addPlayerCard(){
    if(!this.ifStand){
      const newCard = document.createElement("div");
      newCard.setAttribute("class", "card");
      const hand = document.getElementById("player-hand");
      hand.appendChild(newCard);
      this.playerHand[this.playerHand.length] = this.deck.deck[this.topOfDeck];
      this.topOfDeck++;
      const cardText = document.createTextNode(this.playerHand[this.playerHand.length - 1].rank + this.playerHand[this.playerHand.length - 1].suit)
      newCard.setAttribute("id", "playerThirdCard");
      if(this.playerHand.length === 4){
        newCard.setAttribute("id", "playerFourthCard");
      }
      if(this.playerHand.length === 5){
        newCard.setAttribute("id", "playerFifthCard");
      }
      newCard.appendChild(cardText);
      if(this.playerTotal() > 21) {
        if(this.checkAce(this.playerHand)){
         this.stand();
        }
      }
      else if(this.playerTotal() === 21){
        this.stand();
      }
      if(this.playerTotal < 21 && this.playerHand.length === 5){
        this.win();
      }
    }
  }

  doubleDown(){
    if(!this.ifStand){
      if((parseInt(this.bet) * 2) > this.balance){}
      else{
        this.bet = parseInt(this.bet) * 2;
        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card");
        const hand = document.getElementById("player-hand");
        hand.appendChild(newCard);
        this.playerHand[this.playerHand.length] = this.deck.deck[this.topOfDeck];
        this.topOfDeck++;
        const firstCard = document.createTextNode(this.playerHand[this.playerHand.length - 1].rank + this.playerHand[this.playerHand.length - 1].suit)
        newCard.setAttribute("id", "playerThirdCard");
        if(this.playerHand.length === 4){
          newCard.setAttribute("id", "playerFourthCard");
        }
        else if(this.playerHand.length === 5){
          newCard.setAttribute("id", "playerFifthCard");
        }
        newCard.appendChild(firstCard);
        if(this.playerTotal < 21 && this.playerHand.length === 5){
          this.win();
        }
        else{
          this.stand();
        }
      }
    }
  }
  
  addDealerCard() {
    const newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    if(this.dealerHand.length === 2){
      newCard.setAttribute("id", "dealerThirdCard");
    }
    else if(this.dealerHand.length === 3){
      newCard.setAttribute("id", "dealerFourthCard");
    }
    else if(this.dealerHand.length === 4){
      newCard.setAttribute("id", "dealerFifthCard");
    }
    else if(this.dealerHand.length === 5){
      newCard.setAttribute("id", "dealerSixthCard")
    }
    else if(this.dealerHand.length === 6){
      newCard.setAttribute("id", "dealerSeventhCard")
    }
    const hand = document.getElementById("dealer-hand");
    hand.appendChild(newCard);
    this.dealerHand[this.dealerHand.length] = this.deck.deck[this.topOfDeck];
    this.topOfDeck++;
  
    const cardText = document.createTextNode(this.dealerHand[this.dealerHand.length - 1].rank + this.dealerHand[this.dealerHand.length - 1].suit)
    let card = document.getElementById("dealerThirdCard");
    if(this.dealerHand.length === 4){
      card = document.getElementById("dealerFourthCard");
    }
    else if(this.dealerHand.length === 5){
      card = document.getElementById("dealerFifthCard")
    }
    else if(this.dealerHand.length === 6){
      card = document.getElementById("dealerSixthCard")
    }
    else if(this.dealerHand.length === 7){
      card = document.getElementById("dealerSeventhCard")
    }
    card.appendChild(cardText);
  }
  
  stand(){
    if(this.ifStand === false) {
      let first = document.querySelector("#dealerFirstCard");
      first.innerHTML = this.dealerHand[0].rank + this.dealerHand[0].suit;
      this.ifStand = true;
      this.determineWinnings();
    }
  }
  
  determineWinnings() {
    if(this.playerTotal() > 21){
      this.lose();
    }
    else{
      while(this.dealerTotal() < 17) {
        this.addDealerCard();
        if(this.dealerTotal() > 21){
          this.checkAce(this.dealerHand);
        }
      }

      
      if (this.playerTotal() >= this.dealerTotal() || this.dealerTotal() > 21) {
        if(this.dealerTotal == this.playerTotal){
          this.tie();
        }
        else{
          this.win();
        }
      }
      else {
        this.lose();
      }
    }
  }

  async tie() {
    alert("It's A Tie!")
  }
  
  async win() {
    this.balance = parseInt(this.balance) + parseInt(this.bet);
    const date = new Date().toLocaleDateString();
    const username = this.getPlayerName();
    try {
      const response = await fetch(`/api/setbalance`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({score: this.balance, name: username, date: date}),
      });
      // Store what the service gave us as the high scores
      const scores = await response.json();

      if(response?.status === 200){
        localStorage.setItem('scores', JSON.stringify(scores));
        localStorage.setItem('balance', this.balance);
        const currBalance = document.querySelector("#curr-balance");
        currBalance.innerHTML = (this.balance);
      }
    }
    catch(e){
      console.log(e);
    }
    alert("You win!");
  }
  
  async lose() {
    this.balance = parseInt(this.balance) - parseInt(this.bet);
    const date = new Date().toLocaleDateString();
    const username = this.getPlayerName();
    try {
      const response = await fetch(`/api/setbalance`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({score: this.balance, name: username, date: date}),
      });
      // Store what the service gave us as the high scores
      const scores = await response.json();

      if(response?.status === 200){
        localStorage.setItem('scores', JSON.stringify(scores));
        localStorage.setItem('balance', this.balance);
        const currBalance = document.querySelector("#curr-balance");
        currBalance.innerHTML = (this.balance);
      }
    }
    catch(e){
      console.log(e);
    }
    alert("You suck!");
  }
  
  clearHand(){
    const dealerHand = document.querySelector("#dealer-hand")
    const playerHand = document.querySelector("#player-hand")
  
    while(dealerHand.firstChild){
      dealerHand.removeChild(dealerHand.firstChild);
    }
    while(playerHand.firstChild){
      playerHand.removeChild(playerHand.firstChild);
    }
  
    let newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    newCard.setAttribute("id", "dealerFirstCard");
    dealerHand.appendChild(newCard);
    newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    newCard.setAttribute("id", "dealerSecondCard");
    dealerHand.appendChild(newCard);
  
    newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    newCard.setAttribute("id", "playerFirstCard");
    playerHand.appendChild(newCard);
    newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    newCard.setAttribute("id", "playerSecondCard");
    playerHand.appendChild(newCard);
  
  }

  setUsername() {
    const playerNameEl = document.querySelector('.player-name');
    playerNameEl.textContent = this.getPlayerName();
  }
  
  getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
  }

  async getBalance(){
    const userName = this.getPlayerName();
    try {
      const response = await fetch(`/api/balance/${userName}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      });
      // Store what the service gave us as the high scores
      const body = await response.json();

      if(response?.status === 200){
        const userBalance = body.balance;
        this.balance = userBalance;
        localStorage.setItem('balance', body.balance);
        const currBalance = document.querySelector("#curr-balance");
        const balance = document.createTextNode(userBalance);
        currBalance.appendChild(balance);
      }
      else{
        this.balance = 100;
        localStorage.setItem('balance', 100);
        const currBalance = document.querySelector("#curr-balance");
        const balance = document.createTextNode(100);
        currBalance.appendChild(balance);
      }
    } catch(e) {
      console.log(e);
      this.balance = 100;
      localStorage.setItem('balance', 100);
      const currBalance = document.querySelector("#curr-balance");
      const balance = document.createTextNode(100);
      currBalance.appendChild(balance);
    }
  }

  getBet(){
    this.pop();
  }
  getBetHelper(){
    const bet = document.querySelector("#bet").value;
    if(isNaN(bet) && !this.badBet){
      const popup = document.querySelector('#bet-getter');
      const text = document.createElement("div");
      text.setAttribute("class", "popup")
      text.style.color = 'orange';
      text.appendChild(document.createTextNode("You must enter a number"));
      popup.appendChild(text);
      this.badBet = true;
    }
    else if(bet > this.balance && !this.badBet){
      const popup = document.querySelector('#bet-getter');
      const text = document.createElement("div");
      text.setAttribute("class", "popup")
      text.style.color = 'orange';
      text.appendChild(document.createTextNode("You cannot bet more than " + this.balance));
      popup.appendChild(text);
      this.badBet = true;
    }
    else if( bet <= this.balance){
      this.badBet = false;
      this.bet = bet;
      this.hide();
      this.play();
    }
  }

  pop(){
    document.querySelector("#popDiv").style.display = 'block';
  }
  hide(){
    document.querySelector('#popDiv').style.display = 'none';
  }
}


const game = new Game();





