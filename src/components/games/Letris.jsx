import { useEffect, useState, useRef, Fragment } from "react";
import "./Letris.css";
import { motion, useAnimation } from "framer-motion";
import { useWordChecker } from "react-word-checker";
import downwordSkyline from "../../assets/downword-skyline.svg";

function Letris(props) {
  const [stars, setStars] = useState([]);

  const notificationAnimation = useAnimation();
  const host = props.roomInfo.players[0] === props.name ? true : false;
  const word = useWordChecker("en");

  const [notification, setNotification] = useState("Get Ready...");
  const [words, setWords] = useState([]);
  const [score, setScore] = useState(0);
  const [borders, setBorders] = useState([
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

  const [timerInterval, setTimerInterval] = useState(10000);

  const [foundIndices, _setFoundIndices] = useState([]);
  const foundIndicesRef = useRef(foundIndices);
  const setFoundIndices = (data) => {
    foundIndicesRef.current = data;
    _setFoundIndices(data);
    let tempBorders = [
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
    ];
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 7; c++) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].x === c && data[i].y === r) {
            tempBorders[r][c] = true;
          }
        }
      }
    }

    setBorders([...tempBorders]);
  };

  const [board, _updateBoard] = useState([
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
  ]);

  const boardRef = useRef(board);
  const updateBoard = (data) => {
    boardRef.current = data;
    _updateBoard(data);
  };

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

  const [currentLetter, _setCurrentLetter] = useState({
    letter: letterPicker(),
    row: 0,
    column: 3,
  });

  const currentLetterRef = useRef(currentLetter);
  const setCurrentLetter = (data) => {
    currentLetterRef.current = data;
    _setCurrentLetter(data);
  };

  const [letterShadow, _setLetterShadow] = useState({
    row: 19,
    column: 3,
  });

  const letterShadowRef = useRef(letterShadow);
  const setLetterShadow = (data) => {
    letterShadowRef.current = data;
    _setLetterShadow(data);
  };

  const [nextLetter, setNextLetter] = useState(letterPicker());

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(stars);
      if (
        e.key === "ArrowLeft" &&
        currentLetter.column !== 0 &&
        currentLetter.row > 0 &&
        board[currentLetter.row][currentLetter.column - 1] === ""
      ) {
        setCurrentLetter({
          ...currentLetter,
          column: currentLetter.column - 1,
        });

        for (let i = 14; i >= 0; i--) {
          if (board[i][currentLetter.column - 1] === "") {
            setLetterShadow({
              ...letterShadow,
              row: i,
              column: currentLetter.column - 1,
            });
            break;
          }
        }
      } else if (
        e.key === "ArrowRight" &&
        currentLetter.column !== 6 &&
        currentLetter.row > 0 &&
        board[currentLetter.row][currentLetter.column + 1] === ""
      ) {
        setCurrentLetter({
          ...currentLetter,
          column: currentLetter.column + 1,
        });

        for (let i = 14; i >= 0; i--) {
          if (board[i][currentLetter.column + 1] === "") {
            setLetterShadow({
              ...letterShadow,
              row: i,
              column: currentLetter.column + 1,
            });
            break;
          }
        }
      } else if (e.key === "ArrowDown" && currentLetter.row > 0) {
        setScore((score) => score + 100);
        console.log(0);
        for (let i = 14; i >= 0; i--) {
          if (board[i][currentLetter.column] === "") {
            let tempBoard = board;
            tempBoard[i][currentLetter.column] = currentLetter.letter;
            updateBoard([...tempBoard]);
            dropNewLetter();
            break;
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [currentLetter, board, score]);

  useEffect(() => {
    let starMap = [];

    for (let i = 0; i < 500; i++) {
      starMap.push({
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.random() * window.innerHeight,
        size: Math.random() * 5 + 5,
      });
    }

    setStars([...starMap]);

    if (host) {
      props.socket.emit("iniialize_letris_game", props.room, (res) => {
        if (res.success) {
          props.updateRoom(
            props.roomInfo.players,
            props.roomInfo.ready,
            res.gameInfo
          );
        } else {
          alert("Could not initialize game");
        }
      });
    }

    notificationAnimation.set({
      color: "yellow",
    });
    notificationAnimation
      .start({
        opacity: 0,
        transition: { duration: 4.5 },
      })
      .then(() => {
        setNotification("GO!");
      });

    const waitTimer = setTimeout(() => {
      notificationAnimation.set({ opacity: 1 });
      notificationAnimation.start({
        color: "green",
        opacity: 0,
        transition: { duration: 1 },
      });
      setTimerInterval(600);
    }, 5000);
  }, []);

  useEffect(() => {
    const letrisInterval = setInterval(() => {
      const letter = currentLetterRef.current;
      const indices = foundIndicesRef.current;
      const shadow = letterShadowRef.current;

      if (indices.length > 0) {
        dropBoard(indices);

        if (!checkBoardForWords()) {
          setFoundIndices([...[]]);
          updateLetrisGame();
          setCurrentLetter({ ...letter, row: letter.row + 1 });

          for (let i = 14; i >= 0; i--) {
            if (board[i][3] === "") {
              setLetterShadow({
                ...letterShadow,
                row: i,
                column: 3,
              });
              break;
            }
          }
        }
      } else {
        if (letter.row === 14 || board[letter.row + 1][letter.column] !== "") {
          let tempBoard = boardRef.current;
          tempBoard[letter.row][letter.column] = letter.letter;
          updateBoard([...tempBoard]);
          dropNewLetter();
        } else {
          setCurrentLetter({ ...letter, row: letter.row + 1 });
        }
      }
    }, timerInterval);

    return () => clearInterval(letrisInterval);
  }, [timerInterval]);

  const dropBoard = (indices) => {
    let tempBoard = board;

    for (let i = 0; i < indices.length; i++) {
      for (let c = indices[i].y; c >= 2; c--) {
        tempBoard[c][indices[i].x] = tempBoard[c - 1][indices[i].x];
      }
    }

    updateBoard([...tempBoard]);
  };

  const checkBoardForWords = () => {
    let dirsX = [1, 0];
    let dirsY = [0, 1];

    let removedIndices = [{ x: 3, y: 0 }];

    let scoreChange = 0;
    let numScoreChange = 0;
    let tempWords = [];

    for (let r = 2; r < 15; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] === "") {
          continue;
        }
        for (let d = 0; d < 2; d++) {
          let formedWord = board[r][c];
          for (let len = 1; len < 15; len++) {
            if (r + len * dirsY[d] > 14 || c + len * dirsX[d] > 6) {
              break;
            }
            if (board[r + len * dirsY[d]][c + len * dirsX[d]] !== "") {
              formedWord += board[r + len * dirsY[d]][c + len * dirsX[d]];
              if (word.wordExists(formedWord) && len > 2) {
                tempWords.push(formedWord);
                scoreChange += 1000 * Math.pow(5, formedWord.length - 4);
                numScoreChange++;
                for (let i = 0; i <= len; i++) {
                  removedIndices.push({
                    x: c + i * dirsX[d],
                    y: r + i * dirsY[d],
                  });
                }
              }
            } else {
              break;
            }
          }
        }
      }
    }

    setWords([...tempWords, ...words]);

    if (scoreChange > 0) {
      setScore(score + scoreChange * Math.pow(4, numScoreChange - 1));
      setNotification(
        `${numScoreChange > 1 ? "COMBO x" + numScoreChange + "! " : ""} +${
          scoreChange * Math.pow(4, numScoreChange - 1)
        }`
      );
      notificationAnimation.set({ opacity: 1, color: "yellow" });
      notificationAnimation.start({
        opacity: 0,
        transition: { duration: 0.5 },
      });
    }

    if (removedIndices.length > 1) {
      setTimerInterval(timerInterval + 1);
    }

    setFoundIndices([...removedIndices]);

    return numScoreChange > 0;
  };

  const updateLetrisGame = () => {
    props.socket.emit("update_letris_game", props.room, board, (res) => {
      if (res.success) {
        //nothing
      } else {
        alert("Error updating game.");
      }
    });
  };

  const dropNewLetter = () => {
    checkBoardForWords();

    if (timerInterval > 100) {
      setTimerInterval(timerInterval - 1);
    }

    for (let i = 0; i < 7; i++) {
      if (board[2][i] !== "") {
        setTimerInterval(999999);
        alert("Game Over! Score: " + score + "\nPress OK to play again.");
        setScore(0);
        updateBoard([...[
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
        ]]);
        setTimerInterval(600);
      }
    }

    setCurrentLetter({
      letter: nextLetter,
      row: 0,
      column: 3,
    });

    setLetterShadow({
      ...letterShadow,
      row: 0,
      column: 3,
    });

    setNextLetter(letterPicker());
  };

  return (
    <div className="letris-container">
      <div className="letris-star-container">
        {stars.map((star, index) => (
          <div
            key={index}
            className="letris-star"
            style={{
              top: star.y + "px",
              left: star.x + "px",
              height: star.size + "px",
              width: star.size + "px",
            }}
          ></div>
        ))}
      </div>
      <div class="clouds"></div>
      <img src={downwordSkyline} className="letris-skyline" />
      <div>
        {/* {props.roomInfo.gameInfo.letrisInfo.map((viewedBoard, index) => (
          <Fragment key={index}>
          {viewedBoard.board.map((row, rowIndex) => (
            <div
              className="letris-board-row"
              key={"Row " + rowIndex}
              style={
                rowIndex === 2
                  ? {
                      borderBottom: "5px",
                      borderLeft: "0",
                      borderRight: "0",
                      borderTop: "0",
                      borderColor: "red",
                      borderStyle: "solid",
                    }
                  : {}
              }
            >
              {board[rowIndex].map((letter, columnIndex) => (
                <div
                  className="letris-board-letter"
                  key={"Tile on row " + rowIndex + ", column " + columnIndex}
                  style={
                    letter !== ""
                      ? { backgroundColor: "#CCCCCC" }
                      : {}
                  }
                >
                </div>
              ))}
            </div>
          ))}
          </Fragment>
        ))} */}
      </div>
      <div className="letris-middle-container">
        <div>
          {board.map((row, rowIndex) => (
            <div
              className="letris-board-row"
              key={"Row " + rowIndex}
              style={
                rowIndex === 2
                  ? {
                      borderBottom: "5px",
                      borderLeft: "0",
                      borderRight: "0",
                      borderTop: "0",
                      borderColor: "rgb(162, 83, 172)",
                      borderStyle: "solid",
                    }
                  : {}
              }
            >
              {board[rowIndex].map((letter, columnIndex) => (
                <div
                  className="letris-board-letter"
                  key={"Tile on row " + rowIndex + ", column " + columnIndex}
                  style={{
                    backgroundColor:
                      (currentLetter.row === rowIndex &&
                        currentLetter.column === columnIndex) ||
                      letter !== ""
                        ? "#333333"
                        : "",
                    border: borders[rowIndex][columnIndex]
                      ? "5px solid rgb(101, 181, 224)"
                      : "",
                  }}
                >
                  <span
                    style={
                      !(
                        currentLetter.row === rowIndex &&
                        currentLetter.column === columnIndex
                      ) &&
                      letterShadow.row === rowIndex &&
                      letterShadow.column === columnIndex
                        ? { color: "#999999" }
                        : {}
                    }
                  >
                    {(currentLetter.row === rowIndex &&
                      currentLetter.column === columnIndex) ||
                    (letterShadow.row === rowIndex &&
                      letterShadow.column === columnIndex)
                      ? currentLetter.letter
                      : ""}
                    {letter}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="letris-sidebar">
          <div className="letris-sidebar-square-container">
            <h2>Next Letter</h2>
            <h1>{nextLetter}</h1>
          </div>
          <div className="letris-sidebar-square-container">
            <h2>Score</h2>
            <h1>{score}</h1>
          </div>
          <div className="letris-sidebar-word-container">
            <h2>Words</h2>
            {words.map((word, index) => (
              <h3 key={index}>{word}</h3>
            ))}
          </div>
        </div>
      </div>
      <div></div>
      <motion.div
        animate={notificationAnimation}
        transition={{ ease: "linear", duration: 2 }}
        className="notification-container"
      >
        <h1>{notification}</h1>
      </motion.div>
    </div>
  );
}

export default Letris;
