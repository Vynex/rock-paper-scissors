const generateRoom = () => {
	const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let roomID = '';

	for (let i = 0; i != 4; i++)
		roomID += charSet.charAt(Math.floor(Math.random() * charSet.length));

	return roomID;
};

export default generateRoom;
