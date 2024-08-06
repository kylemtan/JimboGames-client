import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Lobby.css";
import { GameSelectors as games } from "./constants/GameSelectors";

function Lobby(props) {
  const navigate = useNavigate();

  const [joined, setJoined] = useState(false);

  const host = props.roomInfo.players[0] === props.name ? " (Host)" : "";

  let animationX = `${window.innerWidth + 200}px`;

  useEffect(() => {
    if (props.room === "") {
      navigate("/");
    }

    props.socket.on("starting_game", () => {
      navigate("/" + props.room + "/game/" + props.roomInfo.gameInfo.gameID);
    });
  }, [props.socket]);

  const selectGame = (gameID) => {
    setJoined(false);
    props.socket.emit("select_game", props.room, gameID, (res) => {
      if (res.success) {
        props.updateRoom(props.roomInfo.players, res.ready, res.gameInfo);
      } else {
        alert("Your game was not properly updated. Try making another lobby.");
      }
    });
  };

  const joinTeam = (index) => {
    setJoined(true);
    props.socket.emit("join_team", props.room, index, (res) => {
      if (res.success) {
        props.updateRoom(
          props.roomInfo.players,
          props.roomInfo.ready,
          res.gameInfo
        );
      } else {
        alert(res.message);
      }
    });
  };

  const setReady = () => {
    props.socket.emit("set_ready", props.room, (res) => {
      if (res.success) {
        props.updateRoom(
          props.roomInfo.players,
          res.ready,
          props.roomInfo.gameInfo
        );
      } else {
        alert(res.message);
      }
    });
  };

  const startGame = () => {
    props.socket.emit("start_game", props.room, (res) => {
      if (res.success) {
        navigate("/" + props.room + "/game/" + props.roomInfo.gameInfo.gameID);
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <div className="split-box">
      <div className="half-box">
        <div className="header-container">
          <h1>ROOM "{props.room}"</h1>
        </div>
        <div className="room-container">
          <div className="players-container">
            <div className="room-header-container">
              <h2>LOBBY</h2>
            </div>
            <div className="player-name-container">
              {props.roomInfo.players.map((player, index) => (
                <h3
                  style={{
                    background: props.roomInfo.ready.includes(player)
                      ? "#03C04A"
                      : "#EEEEEE",
                  }}
                  className="player-name"
                  key={index}
                >
                  {player}
                  {props.roomInfo.players[0] === player ? " (Host)" : ""}
                </h3>
              ))}
            </div>
          </div>
          <div className="players-container">
            <div className="room-header-container">
              <h2>GAME</h2>
            </div>
            {props.roomInfo.gameInfo.gameID !== undefined ? (
              <>
                <h1>{props.roomInfo.gameInfo?.name}</h1>
                {props.roomInfo.gameInfo?.teams
                  ? props.roomInfo.gameInfo?.teams.map((team, index) => (
                      <div key={index}>
                        <h2 style={{ marginBottom: 0 }}>{team.name}</h2>
                        <div className="player-name-container">
                          {team.players.map((player, index) => (
                            <h3
                              style={{
                                background: props.roomInfo.ready.includes(
                                  player
                                )
                                  ? "#03C04A"
                                  : "#EEEEEE",
                              }}
                              className="player-name"
                              key={index}
                            >
                              {player}
                              {props.roomInfo.players[0] === player
                                ? " (Host)"
                                : ""}
                            </h3>
                          ))}
                        </div>
                        <button
                          className="select-button"
                          onClick={() => {
                            joinTeam(index);
                          }}
                          disabled={
                            team.players.length >= team.max ? true : false
                          }
                        >
                          <h3 style={{ margin: 0 }}>Join {team.name}</h3>
                        </button>
                      </div>
                    ))
                  : ""}
                <button
                  disabled={joined ? false : true}
                  style={{
                    background: props.roomInfo.ready.includes(props.name)
                      ? "#03C04A"
                      : joined
                      ? "#e9b50b"
                      : "",
                  }}
                  className="ready-button"
                  onClick={setReady}
                >
                  <h2>
                    {props.roomInfo.ready.includes(props.name)
                      ? "READY!"
                      : "READY UP!"}
                  </h2>
                </button>
                {host !== "" ? (
                  <button
                    disabled={
                      props.roomInfo.ready.length ===
                      props.roomInfo.players.length
                        ? false
                        : true
                    }
                    className="ready-button"
                    onClick={startGame}
                  >
                    <h2>START GAME!</h2>
                  </button>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <h1>NOTHING SELECTED YET</h1>
            )}
          </div>
        </div>
      </div>
      <div className="half-box">
        <div className="header-container">
          <h1>GAMES</h1>
        </div>
        <div className="games-container">
          {games.map((game, index) => (
            <div className="game-wrapper" key={index}>
              <h2 className="game-title">{game.name}</h2>
              <h3>{game.description}</h3>
              <h3>
                # of players: {game.playerMin}
                {game.playerMax > game.playerMin ? "-" + game.playerMax : ""}
              </h3>
              <button
                className="select-button"
                onClick={() => {
                  selectGame(game.gameID);
                }}
              >
                <h2>Select</h2>
              </button>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        className="splash-screen"
        animate={{ x: animationX }}
        transition={{ ease: "easeInOut", duration: 1 }}
      >
        <div className="big-logo">
          <h1>JimboGames</h1>
        </div>
      </motion.div>
    </div>
  );
}

export default Lobby;
