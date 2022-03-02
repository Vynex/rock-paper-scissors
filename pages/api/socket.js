import { Server } from 'socket.io';
const rooms = {};

const SocketHandler = async (req, res) => {
	if (res.socket.server.io) {
		console.log('Socket is Already Active');
	} else {
		console.log('Initialising Web Socket');

		const io = new Server(res.socket.server);
		res.socket.server.io = io;

		io.on('connection', (socket) => {
			socket.on('join-room', (roomID, cb) => {
				if (!rooms[roomID]) rooms[roomID] = [];

				if (rooms[roomID].length < 2) {
					console.log(`${socket.id} joined room #${roomID}`);
					rooms[roomID].push({ user: socket.id, move: '' });

					socket.join(roomID);

					socket.to(roomID).emit('user-joined', { id: socket.id });

					if (rooms[roomID].length === 2) {
						console.log('Two Players have Connected');

						cb(rooms[roomID]);

						socket.to(roomID).emit('game-ready', 'Ready');
					}

					socket.on('throw-hand', (move, callback) => {
						socket.to(roomID).emit('hand-thrown', move);
						const p1 = rooms[roomID][0];
						const p2 = rooms[roomID][1];

						if (p1.user === socket.id) p1.move = move;
						else p2.move = move;

						if (p1.move && p2.move) {
							const result = getResult(p1, p2);

							socket.to(roomID).emit('game-finished', result);
							callback(result);
						}
					});
				} else {
					console.log(`${socket.id} tried to Connect and Failed.`);
					socket.emit('room-full', roomID);
				}

				socket.on('disconnect', () => {
					console.log(`${socket.id} left the Room`);
					rooms[roomID] = rooms[roomID].filter(
						(e) => e.user !== socket.id
					);

					if (rooms[roomID].length === 0) delete rooms[roomID];

					socket.leave(roomID);
				});
			});
		});
	}
	res.end();
};

const getResult = (player1, player2) => {
	if (player1.move === player2.move) {
		return { status: 'Tie', winner: null };
	}

	if (player1.move === 'Rock') {
		if (player2.move === 'Scissors')
			return { status: 'Win', winner: player1.user };
		if (player2.move === 'Paper')
			return { status: 'Win', winner: player2.user };
	}
	if (player1.move === 'Paper') {
		if (player2.move === 'Rock')
			return { status: 'Win', winner: player1.user };
		if (player2.move === 'Scissors')
			return { status: 'Win', winner: player2.user };
	}
	if (player1.move === 'Scissors') {
		if (player2.move === 'Paper')
			return { status: 'Win', winner: player1.user };
		if (player2.move === 'Rock')
			return { status: 'Win', winner: player2.user };
	}
};

export default SocketHandler;
