const moment = require("moment");

const formatMessage = (username, text) => ({
	username,
	text,
	time: moment().format("h:m a"),
});

module.exports = formatMessage;
