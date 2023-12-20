import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import Message from "./database/messageSchema.js";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "GET,POST",
    credentials: true,
  },
});

const mongoDBAtlasUri =
  "mongodb+srv://ibrahimmo989800:chMdI1tzwfaE7qTr@chat.nnnumvw.mongodb.net/chats?retryWrites=true&w=majority";
mongoose
  .connect(mongoDBAtlasUri)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("user joined", data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.id).emit("reseve_message", data);
    console.log(data);
    const newUser = new Message({ ...data });
    newUser
      .save()
      .then(() => console.log("message saved"))
      .catch((err) => console.error("Error creating user:", err));
  });

  socket.on("fetch_messages", async (room) => {
    Message.find({ id: room })
      .then((messages) => {
        socket.emit("display_messages", messages);
      })
      .catch((err) => console.error("Error", err));
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
