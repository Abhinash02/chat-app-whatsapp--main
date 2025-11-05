

// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   autoConnect: false,
// });

// export default socket;
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   autoConnect: false,
// });

// export default socket;




// src/app/utils/socket.client.js
import { io } from "socket.io-client";

let socket;

if (typeof window !== "undefined") {
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
  transports: ["websocket"],        
  socket = io(SOCKET_URL, {
    autoConnect: false,
  });
}

export default socket;