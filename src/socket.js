import { io } from "socket.io-client";

 //const URL = "http://localhost:3000";
  const URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(URL, {

  autoConnect: true,

  transports: ["websocket"],

});

export default socket;