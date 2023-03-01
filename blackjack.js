let deck = [];
let dealerHand = [];
let playerHand = [];
let topOfDeck = 5;
let cardsInHand = 2;
let ifStand = false;

function createDeck() {
  let suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  let ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
  let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      let card = {
        suit: suits[i],
        rank: ranks[j],
        value: values[j]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealCards() {
  dealerHand = [deck[0], deck[2]];
  playerHand = [deck[1], deck[3]];
  console.log("Dealer's hand:")
  console.log(dealerHand);
  console.log("Player's hand:")
  console.log(playerHand);
}

function outputHands(){
  let firstCard = document.createTextNode("Hidden Card \n" + dealerHand[0].rank + " of " + dealerHand[0].suit);
  let card = document.getElementById("dealerFirstCard");
  card.appendChild(firstCard);
  let secondCard = document.createTextNode(dealerHand[1].rank + " of " + dealerHand[1].suit);
  card = document.getElementById("dealerSecondCard");
  card.appendChild(secondCard);
  firstCard = document.createTextNode(playerHand[0].rank + " of " + playerHand[0].suit);
  card = document.getElementById("playerFirstCard");
  card.appendChild(firstCard);
  firstCard = document.createTextNode(playerHand[1].rank + " of " + playerHand[1].suit);
  card = document.getElementById("playerSecondCard");
  card.appendChild(firstCard);
}

function playerTotal(){
  let temp = 0;
  for(let i = 0; i < playerHand.length; i++){
    temp += playerHand[i].value;
  }
  return temp;
}

function dealerTotal(){
  let temp = 0;
  for(let i = 0; i < dealerHand.length; i++){
    temp += dealerHand[i].value;
  }
  return temp;
}

function addPlayerCard(){
  if(playerHand.length < 5 && !ifStand){
    const newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    if(playerHand.length === 2){
      newCard.setAttribute("id", "playerThirdCard");
    }
    else if(playerHand.length === 3){
      newCard.setAttribute("id", "playerFourthCard");
    }
    else if(playerHand.length === 4){
      newCard.setAttribute("id", "playerFifthCard");
    }
    const hand = document.getElementById("player-hand");
    hand.appendChild(newCard);
    playerHand[playerHand.length] = deck[topOfDeck];
    topOfDeck++;
    console.log("Dealer's hand:");
    console.log(dealerHand);
    console.log("Player's hand:");
    console.log(playerHand);
    const firstCard = document.createTextNode(playerHand[playerHand.length - 1].rank + " of " + playerHand[playerHand.length - 1].suit)
    let card = document.getElementById("playerThirdCard");
    if(playerHand.length === 4){
      card = document.getElementById("playerFourthCard");
    }
    if(playerHand.length === 5){
      card = document.getElementById("playerFifthCard")
    }
    card.appendChild(firstCard);
    if(playerTotal() > 21) lose();
    else if(playerTotal() === 21) win();
  }
  else{
    win();
  }
}

function stand(){
  ifStand = true;
  determineWinnings();
}

function determineWinnings() {
  while(dealerTotal() < 17) {
    addDealerCard();
  }

  if (playerTotal() >= dealerTotal() || dealerTotal() > 21) {
    win();
  }
  else {
    lose();
  }
}

function win() {
  setTimeout(() => {
    alert("You win!");
  }, 1000);
}

function lose() {
  setTimeout(() => {
    alert("You suck!");
  }, 1000);
}

function addDealerCard() {
  const newCard = document.createElement("div");
  newCard.setAttribute("class", "card");
  if(dealerHand.length === 2){
    newCard.setAttribute("id", "dealerThirdCard");
  }
  else if(dealerHand.length === 3){
    newCard.setAttribute("id", "dealerFourthCard");
  }
  else if(dealerHand.length === 4){
    newCard.setAttribute("id", "dealerFifthCard");
  }
  const hand = document.getElementById("dealer-hand");
  hand.appendChild(newCard);
  dealerHand[dealerHand.length] = deck[topOfDeck];
  topOfDeck++;

  const cardText = document.createTextNode(dealerHand[dealerHand.length - 1].rank + " of " + dealerHand[dealerHand.length - 1].suit)
  let card = document.getElementById("dealerThirdCard");
  if(dealerHand.length === 4){
    card = document.getElementById("dealerFourthCard");
  }
  if(dealerHand.length === 5){
    card = document.getElementById("dealerFifthCard")
  }
  card.appendChild(cardText);
}

document.getElementById("hit-button").addEventListener('click', addPlayerCard);
document.getElementById("stand-button").addEventListener('click', stand);

createDeck();
shuffleDeck(deck);
dealCards();
outputHands();