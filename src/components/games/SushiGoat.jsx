import { useEffect, useState } from "react";
import { useWordChecker } from "react-word-checker";
import { useTimer } from "react-timer-hook";
import "./SushiGoat.css";

function SushiGoat(props) {
  const isWord = useWordChecker("en");

  const [waiting, setWaiting] = useState(false);
  const [swap, setSwap] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ]);
  const [pressed, setPressed] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [word, setWord] = useState("");

  const letterPicker = () => {
    const letters = [
      { letter: "A", frequency: 8.167 },
      { letter: "B", frequency: 1.492 },
      { letter: "C", frequency: 2.782 },
      { letter: "D", frequency: 4.253 },
      { letter: "E", frequency: 12.702 },
      { letter: "F", frequency: 2.228 },
      { letter: "G", frequency: 2.015 },
      { letter: "H", frequency: 6.094 },
      { letter: "I", frequency: 6.966 },
      { letter: "J", frequency: 0.153 },
      { letter: "K", frequency: 0.772 },
      { letter: "L", frequency: 4.025 },
      { letter: "M", frequency: 2.406 },
      { letter: "N", frequency: 6.749 },
      { letter: "O", frequency: 7.507 },
      { letter: "P", frequency: 1.929 },
      { letter: "Q", frequency: 0.095 },
      { letter: "R", frequency: 5.987 },
      { letter: "S", frequency: 6.327 },
      { letter: "T", frequency: 9.056 },
      { letter: "U", frequency: 2.758 },
      { letter: "V", frequency: 0.978 },
      { letter: "W", frequency: 2.361 },
      { letter: "X", frequency: 0.15 },
      { letter: "Y", frequency: 1.974 },
      { letter: "Z", frequency: 0.074 },
    ];

    const totalFrequency = letters.reduce(
      (sum, letter) => sum + letter.frequency,
      0
    );
    const randomValue = Math.random() * totalFrequency;

    let cumulativeFrequency = 0;
    for (const letter of letters) {
      cumulativeFrequency += letter.frequency;
      if (randomValue < cumulativeFrequency) {
        return letter.letter;
      }
    }
  };

  const [board, setBoard] = useState([
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]);

  const startNewRound = () => {
    let tempBoard = board;

    if (swap) {
      setSwap(false);
      for (let i = 0; i < 16; i++) {
        tempBoard[Math.floor(i / 4)][i % 4] = letterPicker();
      }
    } else {
      for (let i = 0; i < selectedLetters.length; i++) {
        tempBoard[Math.floor(selectedLetters[i] / 4)][selectedLetters[i] % 4] =
          letterPicker();
      }
    }

    const time = new Date();
    time.setSeconds(time.getSeconds() + 16);
    restart(time)

    setBoard([...tempBoard]);
    setPressed([
      ...[
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    ]);
    setSelectedLetters([...[]]);
    setWord("");
    setWaiting(false);
  };

  const handleButtonClick = (row, column) => {
    const index = row * 4 + column;
    let tempSelectedLetters = selectedLetters;
    let tempPressed = pressed;
    if (pressed[index]) {
      tempSelectedLetters.splice(selectedLetters.indexOf(index), 1);
    } else {
      tempSelectedLetters.push(index);
    }
    tempPressed[index] = !pressed[index];
    setSelectedLetters([...tempSelectedLetters]);
    setPressed([...pressed]);

    let tempWord = "";
    for (let i = 0; i < tempSelectedLetters.length; i++) {
      tempWord +=
        board[Math.floor(tempSelectedLetters[i] / 4)][
          tempSelectedLetters[i] % 4
        ];
    }

    setWord(tempWord);
  };

  const submitWord = (shouldSwap) => {
    props.socket.emit(
      "submit_sushi_goat_word",
      props.room,
      shouldSwap ? "" : word,
      (res) => {
        if (res.success) {
          if (res.newRound) {
            props.updateRoom(
              props.roomInfo.players,
              props.roomInfo.ready,
              res.gameInfo
            );
            startNewRound();
          } else {
            setWaiting(true);
          }
        }
      }
    );
  };

  const {
    seconds,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: new Date().setSeconds(new Date().getSeconds() + 16),
    onExpire: () => {
      submitWord(true)
    },
  });

  useEffect(() => {
    props.socket.emit("iniialize_sushi_goat_game", props.room, (res) => {
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
    console.log(new Date().setSeconds(new Date().getSeconds() + 16))
  }, []);

  useEffect(() => {
    props.socket.on("sushi_goat_new_round", () => {
      startNewRound();
    });
  }, [props.socket]);

  return (
    <div className="sushi-goat-container">
      <div className="sushi-goat-vertical-split">
        {
          <div className="sushi-goat-word-container">
            {selectedLetters.map((letter, index) => (
              <button
                key={index}
                className="sushi-goat-word-container-letter"
                onClick={() => {
                  handleButtonClick(Math.floor(letter / 4), letter % 4);
                }}
              >
                <span>{board[Math.floor(letter / 4)][letter % 4]}</span>
              </button>
            ))}
          </div>
        }
        <button
          className="sushi-goat-submit"
          disabled={
            !isWord.wordExists(word) || word === ""
              ? true
              : waiting
              ? true
              : false
          }
          onClick={() => {
            submitWord(false);
          }}
        >
          {waiting ? "WAITING..." : "SUBMIT!"} {seconds}
        </button>

        <div className="sushi-goat-boat-container">
          <h2>
            {props.roomInfo.gameInfo.teams[0].players[0]}:{" "}
            {
              props.roomInfo.gameInfo.score[
                props.roomInfo.gameInfo.teams[0].players[0]
              ]
            }{" "}
            points
          </h2>
          {props.roomInfo.gameInfo.sushi[
            props.roomInfo.gameInfo.teams[0].players[0]
          ]?.map((sushi, index) => (
            <div key={index}>
              <span>
                Round {index + 1}:{" "}
                {
                  props.roomInfo.gameInfo.words[
                    props.roomInfo.gameInfo.teams[0].players[0]
                  ][index]
                }{" "}
                - {sushi} points
              </span>
            </div>
          ))}
        </div>
        <div className="sushi-goat-boat-container">
          <h2>
            {props.roomInfo.gameInfo.teams[1].players[0]}:{" "}
            {
              props.roomInfo.gameInfo.score[
                props.roomInfo.gameInfo.teams[1].players[0]
              ]
            }{" "}
            points
          </h2>{" "}
          {props.roomInfo.gameInfo.sushi[
            props.roomInfo.gameInfo.teams[1].players[0]
          ]?.map((sushi, index) => (
            <div key={index}>
              <span>
                Round {index + 1}:{" "}
                {
                  props.roomInfo.gameInfo.words[
                    props.roomInfo.gameInfo.teams[1].players[0]
                  ][index]
                }{" "}
                - {sushi} points
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="sushi-goat-vertical-split">
        <button
          onClick={() => {
            setPressed([
              ...[
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
              ],
            ]);
            setSelectedLetters([...[]]);
          }}
        >
          CLEAR BOARD
        </button>
        <div className="sushi-goat-letter-container">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="sushi-goat-letter-container-row">
              {row.map((letter, columnIndex) => (
                <button
                  style={{
                    backgroundColor: `${
                      pressed[rowIndex * 4 + columnIndex] ? "green" : ""
                    }`,
                  }}
                  key={rowIndex + ", " + columnIndex}
                  className="sushi-goat-letter-container-letter"
                  onClick={() => {
                    handleButtonClick(rowIndex, columnIndex);
                  }}
                >
                  <span>{letter}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setWord("");
            submitWord(true);
            setSwap(true);
          }}
        >
          BOARD SWAP
        </button>
      </div>
    </div>
  );
}

export default SushiGoat;
