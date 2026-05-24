const Chat = require("../models/chat.model");
const uploadToCloudinary=require("../helpers/uploadToCloudinary.helper");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const userId = socket.handshake.auth.userId;
      const fullName = socket.handshake.auth.fullName;

      let images=[];
      for(const imageBuffer of data.images){
        const link=await uploadToCloudinary(imageBuffer);
        images.push(link);
      }


      const chat = new Chat({
         user_id: userId,
          content:data.content,
          images:images 
          });
      await chat.save();
      
      io.emit("SERVER_RETURN_MESSAGE", { userId, fullName, content:data.content,images:images });
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