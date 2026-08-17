const jwt = require('jsonwebtoken');
const socketHandler = (io) => {
    // socket middleware
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Unauthorized"));
            }
            const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            if(!user){
                return next(new Error("socket user not found"));
            }
            socket.user = user;

            next(); // allow
        } catch (err) {
            next(new Error("Invalid token"));
        }
    });


    io.on("connection", (socket) => {
        const userId = socket.user.id;
        
        // adding user into socket room
        socket.join(userId);
        console.log("Client Connected:", socket.user.id);

        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.user.id);
        });

         //  yha nhi rhega
        // socket.on("connect_error", (err) => {
        //     console.log(err.message);
        // });

    })
}

module.exports = socketHandler;