import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Home.css";

function Home(props) {
  const navigate = useNavigate();
  const [animationX, setAnimationX] = useState(window.innerWidth + 200)

  useEffect(() => {
    if (props.room !== "" || props.name !== "") {
      props.socket.emit("leave_room");
      props.setName("");
      props.setRoom("");
      props.updateRoom([], {
        gameID: "",
        ready: [],
        teams: [
          {
            name: "",
            players: [],
            max: 1,
          },
        ],
      });
    }
  }, [props.socket]);

  const joinRoom = () => {
    if (props.name.length > 20) {
      alert("Name must be 20 characters or less in length.");
    } else if (props.name === "" || props.room === "") {
      alert("The name and room fields cannot be empty.");
    } else {
      props.socket.emit(
        "join_room",
        { room: props.room, name: props.name },
        (res) => {
          if (res.success) {
            setAnimationX(0);
            props.updateRoom(res.players, res.ready, res.gameInfo);
            const timeoutId = setTimeout(() => {
              navigate("/" + props.room);
            }, 1000);
          } else {
            alert(res.message);
          }
        }
      );
    }
  };

  return (
    <div className="container">
      <div className="input-container">
        <div className="logo-container">
          <h1 className="logo">JimboGames</h1>
        </div>
        <div className="label-container">
          <h2>NAME</h2>
        </div>
        <input
          onChange={(e) => {
            props.setName(e.target.value);
          }}
        />
        <div className="label-container">
          <h2>ROOM</h2>
        </div>
        <input
          onChange={(e) => {
            props.setRoom(e.target.value);
          }}
        />
        <button className="home-button" onClick={joinRoom}>
          <h2>JOIN!</h2>
        </button>
      </div>
      <div className="identity-tag-container">
        <h4 className="identity-tag">
          A mini-game platform by Kyle Macasilli-Tan
        </h4>
      </div>
      <motion.div
        className="splash-screen"
        initial={false}
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

export default Home;
