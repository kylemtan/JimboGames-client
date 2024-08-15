const shuffleDeck = (deck) => {
  let currentIndex = deck.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [deck[currentIndex], deck[randomIndex]] = [
      deck[randomIndex],
      deck[currentIndex],
    ];
  }
}


export const HackjackPrograms = [
  {
    name: "stack_overflow",
    description: "put hand back into deck and draw two new cards",
    action: (player, otherPlayer, hackjackInfo) => {
      for (let i = 0; i < hackjackInfo.board.storage[player].length; i++) {
        hackjackInfo.deck.push(hackjackInfo.board.storage[player].pop());
      }
      shuffleDeck(hackjackInfo.deck);
      hackjackInfo.board.storage[player] = [
        {
          number: tempHackJackInfotempDeck.pop(),
          encrypted: true
        },
        {
          number: tempHackJackInfotempDeck.pop(),
          encrypted: false
        }
      ]
      return hackjackInfo;
    }
  }
]