import { useEffect, useState } from "react";
import "./HackJack.css";

function HackJack(props) {
  const host = props.roomInfo.players[0] === props.name ? true : false;
  const game = props.roomInfo.gameInfo.hackjackInfo;
  const spectator = game.players.includes(props.name) ? false : true;

  const [messages, setMessages] = useState([
    "# COMMENTS:",
    "# programs are listed on the right, use these to help you gain the advantage",
    "# defeat hacker's firewall by stealing more data without going over the storage limit seen on the bar to the right",
  ]);

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

  const startNewRound = () => {
    let tempHackjackInfo = props.roomInfo.gameInfo.hackjackInfo;

    //first, shuffle a new deck
    let tempDeck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    shuffleDeck(tempDeck);

    tempHackjackInfo.board.storage[game.players[0]] = [
      {
        number: tempHackJackInfotempDeck.pop(),
        encrypted: true
      },
      {
        number: tempHackJackInfotempDeck.pop(),
        encrypted: false
      }
    ]
    tempHackjackInfo.board.storage[game.players[1]] = [
      {
        number: tempHackJackInfotempDeck.pop(),
        encrypted: true
      },
      {
        number: tempHackJackInfotempDeck.pop(),
        encrypted: false
      }
    ]
    

    
  };

  useEffect(() => {
    if (host) {
      props.socket.emit("iniialize_hackjack_game", props.room, (res) => {
        if (res.success) {
          props.updateRoom(
            props.roomInfo.players,
            props.roomInfo.ready,
            res.gameInfo
          );
          startNewRound();
        } else {
          alert("Could not initialize game");
        }
      });
    }
  }, []);

  return (
    <div className="hackjack-container">
      <div className="hackjack-side-container">
        <h1>Log</h1>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <div className="hackjack-middle-container"></div>
      <div className="hackjack-side-container">
        <h1>Programs</h1>
        <div></div>
      </div>
    </div>
  );
}

export default HackJack;
