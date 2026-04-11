const Chat = require("../models/chat.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const userId = socket.handshake.auth.userId;
      const fullName = socket.handshake.auth.fullName;
      console.log("Id cua nguoi dung:",userId,fullName);
      const chat = new Chat({ user_id: userId, content });
      await chat.save();
      console.log(chat);
      io.emit("SERVER_RETURN_MESSAGE", { userId, fullName, content });
    });
    socket.on("CLIENT_SEND_TYPING",(type)=>{
         const userId = socket.handshake.auth.userId;
        const fullName = socket.handshake.auth.fullName;
       
        socket.broadcast.emit("SERVER_RETURN_TYPING",{
            userId:userId,
            fullName:fullName,
            type:type
        });
    });
  });
};