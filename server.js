const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/formatMessage");
const {
	joinUser,
	getCurrentUser,
	removeUser,
	getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatCord Bot";

//middlewares
app.use(express.static(path.join(__dirname, "public")));

//

//Run when client connects
io.on("connection", (socket) => {
	//Join user to room
	socket.on("joinRoom", ({ username, room }) => {
		joinUser(socket.id, username, room);

		socket.join(room);

		//welcome new user
		socket.emit("message", formatMessage(botName, "Welcome to the Logs!!"));

		//broadcast when a user has joined
		socket.broadcast
			.to(room)
			.emit(
				"message",
				formatMessage(botName, `${username} has joined the chat !!`)
			);

		//send room and users
		io.to(room).emit("roomUsers", { room, users: getRoomUsers(room) });
	});

	//receive chat message from client
	socket.on("chatMessage", (msg) => {
		const { username, room } = getCurrentUser(socket.id);
		io.to(room).emit("message", formatMessage(username, msg));
	});

	//runs when client disconnects
	socket.on("disconnect", () => {
		const { username, room } = removeUser(socket.id);
		if (username) {
			io.to(room).emit(
				"message",
				formatMessage(botName, `${username} has left the chat!!`)
			);
			//send room and users
			io.to(room).emit("roomUsers", { room, users: getRoomUsers(room) });
		}
	});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server  running on port: ${PORT}`));
