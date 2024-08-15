import { useEffect, useState } from "react";
import { useWordChecker } from "react-word-checker";
import "./SushiGoat.css";

function SushiGoat(props) {
  const isWord = useWordChecker("en");

  const [selectedLetters, setSelectedLetters] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
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
    let randNum = Math.random() * 100;
    if (randNum < 8.497) {
      return "A";
    } else if (randNum < 10.569) {
      return "B";
    } else if (randNum < 15.108) {
      return "C";
    } else if (randNum < 18.492) {
      return "D";
    } else if (randNum < 29.653) {
      return "E";
    } else if (randNum < 31.465) {
      return "F";
    } else if (randNum < 33.936) {
      return "G";
    } else if (randNum < 36.939) {
      return "H";
    } else if (randNum < 44.484) {
      return "I";
    } else if (randNum < 44.681) {
      return "J";
    } else if (randNum < 45.783) {
      return "K";
    } else if (randNum < 51.272) {
      return "L";
    } else if (randNum < 54.285) {
      return "M";
    } else if (randNum < 60.939) {
      return "N";
    } else if (randNum < 68.103) {
      return "O";
    } else if (randNum < 71.27) {
      return "P";
    } else if (randNum < 71.466) {
      return "Q";
    } else if (randNum < 79.047) {
      return "R";
    } else if (randNum < 84.782) {
      return "S";
    } else if (randNum < 91.733) {
      return "T";
    } else if (randNum < 95.364) {
      return "U";
    } else if (randNum < 96.371) {
      return "V";
    } else if (randNum < 97.661) {
      return "W";
    } else if (randNum < 97.951) {
      return "X";
    } else if (randNum < 99.729) {
      return "Y";
    } else {
      return "Z";
    }
  };

  const [board, setBoard] = useState([
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]);

  const startNewRound = () => {
    console.log(selectedLetters)
    let tempBoard = board;
    for (let i = 0; i < selectedLetters.length; i++) {
      tempBoard[Math.floor(selectedLetters[i] / 4)][selectedLetters[i] % 4] = letterPicker();
      console.log(0)
    }

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
  };

  const handleButtonClick = (row, column) => {
    const index = row * 4 + column;
    let tempSelectedLetters = selectedLetters;
    let tempPressed = pressed;
    console.log(selectedLetters);
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

  const submitWord = () => {
    console.log(props.roomInfo.gameInfo);
    props.socket.emit("submit_sushi_goat_word", props.room, word, (res) => {
      if (res.success) {
        if (res.newRound) {
          props.updateRoom(
            props.roomInfo.players,
            props.roomInfo.ready,
            res.gameInfo
          );
          startNewRound();
        }
      }
    });
  };

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
          disabled={!isWord.wordExists(word) || word === "" ? true : false}
          onClick={submitWord}
        >
          SUBMIT!
        </button>

        <div className="sushi-goat-boat-container">
          {props.roomInfo.gameInfo.sushi[
            props.roomInfo.gameInfo.teams[0].players[0]
          ]?.map((sushi, index) => (
            <div key={index}>
              <span>{sushi}</span>
            </div>
          ))}
        </div>
        <div className="sushi-goat-boat-container">
          {props.roomInfo.gameInfo.sushi[
            props.roomInfo.gameInfo.teams[1].players[0]
          ]?.map((sushi, index) => (
            <div key={index}>
              <span>{sushi}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sushi-goat-vertical-split">
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
      </div>
    </div>
  );
}

export default SushiGoat;
