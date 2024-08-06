import { BrowserRouter, Routes, Route } from 'react-router-dom';
import io from "socket.io-client";
import { useState, useEffect } from "react";
import './App.css';

import Home from './components/Home';
import Lobby from './components/Lobby';
import Game from './components/Game';

// const socket = io.connect("http://localhost:3001");
const socket = io.connect("jimbogames-server-production.up.railway.app");

function App() {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [roomInfo, setRoomInfo] = useState({
    players: [],
    ready: [],
    gameInfo: {
      gameID: "",
      teams: [
        {
          name: "",
          players: [],
          max: 1,
        },
      ]
    }
  });

  const updateRoom = (players, ready, gameInfo) => {
    setRoomInfo((roomInfo) => ({...roomInfo, players: [...players], ready: [...ready], gameInfo: gameInfo}));
  }

  useEffect(() => {
    socket.on("room_update", (data) => {
      updateRoom(data.players, data.ready, data.gameInfo);
    });
  }, [socket]);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} room={room} setRoom={setRoom} name={name} setName={setName} updateRoom={updateRoom} roomInfo={roomInfo}/>}></Route>
          <Route path="/:room" element={<Lobby socket={socket} room={room} name={name} roomInfo={roomInfo} updateRoom={updateRoom}/>}></Route>
          <Route path="/:room/game/:game" element={<Game socket={socket} room={room} name={name} roomInfo={roomInfo} updateRoom={updateRoom}/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;