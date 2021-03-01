const form = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const usersList = document.querySelector("#users");
//Get username and room
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

console.log(username, room);
//
const socket = io();

//joining a room
socket.emit("joinRoom", { username, room });

//get Users and room
socket.on("roomUsers", ({ users, room }) => {
	setRoom(room);
	setRoomUsers(users);
});

//listening to server
socket.on("message", (message) => {
	console.log(message);
	addMessageToDOM(message);

	//scroll to bottom
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//chat event listener
form.addEventListener("submit", (e) => {
	e.preventDefault();

	const msg = e.target.elements.msg.value;
	socket.emit("chatMessage", msg);

	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

//create chat message and add to DOM
const addMessageToDOM = (msg) => {
	const message = document.createElement("div");
	message.classList.add("message");
	message.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
	document.querySelector(".chat-messages").appendChild(message);
};

//Set room name
const setRoom = (room) => roomName.innerText(room);

//Set room users
const setRoomUsers = (users) => {
	usersList.innerHTML(
		`${users.map(({ username }) => `<li>${username}</li>`).join("")}`
	);
};
