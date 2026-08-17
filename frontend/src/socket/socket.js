import { io } from "socket.io-client";
import { getAccessToken } from "../api/axios";


export const socket = io(
    import.meta.env.VITE_SOCKET_URL,
    {
        autoConnect: false,
        withCredentials: true,
        transports: ["websocket"],
        // auth: {
        //     token:token,
        // }
    }
);

socket.on("connect_error", (err) => {
    console.log(err.message);
});

// jab connect karna ho
export const connectSocket = () => {
    const token = getAccessToken();
    if (!token) return;
    console.log(token);
    socket.auth = {
        token: token,
    };
    socket.connect();
};


// auto reconnect after accessToken expire
export const reconnectSocket = () => {
    socket.disconnect();

    socket.auth = {
        token: getAccessToken(),
    };
    socket.connect();
}




