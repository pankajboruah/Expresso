const users = [];

//create user
const joinUser = (id, username, room) => {
	const user = { id, username, room };
	users.push(user);
	return user;
};

//get current user
const getCurrentUser = (userId) => users.find(({ id }) => id === userId);

//leave user
const removeUser = (userId) => {
	userIndex = users.findIndex(({ id }) => id === userId);
	if (userIndex !== -1) {
		return users.splice(userIndex, 1)[0];
	}
};

//get room users
const getRoomUsers = (userRoom) =>
	users.filter(({ room }) => room === userRoom);

module.exports = {
	joinUser,
	getCurrentUser,
	removeUser,
	getRoomUsers,
};
