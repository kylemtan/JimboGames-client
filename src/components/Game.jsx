import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import "./Game.css";

// games
import GolfGulf from './games/GolfGulf';
import Letris from "./games/Letris";
import HackJack from "./games/HackJack";
import SushiGoat from "./games/SushiGoat";

function Game(props) {
  const navigate = useNavigate();

  const loadingAnimation = useAnimation();

  const gameSwitch = (gameID) => {
    switch (gameID) {
      case 'game_of_the_generals':
        return;
      case 'golf_gulf':
        return <GolfGulf socket={props.socket} room={props.room} name={props.name} roomInfo={props.roomInfo} updateRoom={props.updateRoom}/>
      case 'letris':
        return <Letris socket={props.socket} room={props.room} name={props.name} roomInfo={props.roomInfo} updateRoom={props.updateRoom}/>
      case 'hackjack':
        return <HackJack socket={props.socket} room={props.room} name={props.name} roomInfo={props.roomInfo} updateRoom={props.updateRoom}/>
      case 'sushi_goat':
        return <SushiGoat socket={props.socket} room={props.room} name={props.name} roomInfo={props.roomInfo} updateRoom={props.updateRoom}/>
      default: 
        return;
    }
  }

  useEffect(() => {
    loadingAnimation.set({ x: 0, });
    loadingAnimation.start({
      x: window.innerWidth + 200,
    });
  }, [])

  useEffect(() => {
    if (props.room === "") {
      navigate("/");
    }
  }, [props.socket])

  return (
    <div className="game-container">
      <div className="navbar">
      <h1>JimboGames</h1>
      <h1>{props.name}   #{props.room}</h1>
      </div>
      <div className="game-box">
        { gameSwitch(props.roomInfo.gameInfo.gameID) }
      </div>
      <motion.div
        className="splash-screen"
        animate={loadingAnimation}
        transition={{ ease: "easeInOut", duration: 1 }}
      >
        <div className="big-logo">
          <h1>JimboGames</h1>
        </div>
      </motion.div>
    </div>
  );
}

export default Game;
