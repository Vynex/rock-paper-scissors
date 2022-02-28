import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

fetch('http://localhost:3000/api/socket');
let socket = io();

const playerState = { id: '', name: '', move: '' };

const Room = () => {
	const router = useRouter();
	const { room } = router.query;

	const [phase, setPhase] = useState('Waiting');
	const [name, setName] = useState('');

	const [player, setPlayer] = useState(playerState);
	const [opponent, setOpponent] = useState(playerState);

	const [playerWin, setPlayerWin] = useState(false);

	useEffect(() => {
		socket.on('connect', () => {
			console.log(`Connected as ${socket.id}`);

			const user = {};
			user.id = socket.id;
			user.name = 'Player 1';
			user.move = '';

			setPlayer(user);
		});

		socket.on('user-joined', (user) => {
			console.log(`${user.id} joined the Room.`);

			user.id = socket.id;
			user.name = 'Player 2';
			user.move = '';

			setOpponent(user);
		});

		socket.on('hand-thrown', (move) => {
			setOpponent((opp) => ({ ...opp, move: move }));
		});

		socket.on('game-finished', (winner) => {
			setPhase('Result');
			if (winner === socket.id) setPlayerWin(true);
		});

		const cleanUp = () => {
			socket.disconnect();
		};

		window.addEventListener('beforeunload', cleanUp);

		return () => {
			window.removeEventListener('beforeunload', cleanUp);
		};
	}, []);

	useEffect(() => {
		socket.on('room-full', (roomID) => {
			console.log(`Room ID ${roomID} is Full.`);
			router.push('/');
		});
	}, [router]);

	useEffect(() => {
		if (room)
			socket.emit('join-room', room, (users) => {
				if (users.length === 2) {
					const user = {
						id: users[0].id,
						name: 'Player 2',
						move: '',
					};

					setOpponent(user);
					setPhase('Ready');
				}
			});
	}, [room]);

	useEffect(() => {
		socket.on('game-ready', (phase) => {
			setPhase(phase);
		});
	}, []);

	const handleReady = () => {
		socket.emit('set-ready', name);
	};

	const handleMove = (moveID) => {
		if (phase !== 'Ready') return;

		let move;
		switch (moveID) {
			case 1: {
				move = 'Rock';
				break;
			}
			case 2: {
				move = 'Paper';
				break;
			}
			case 3: {
				move = 'Scissors';
				break;
			}
		}

		setPlayer((pla) => ({ ...pla, move: move }));

		console.log('throwing', move);
		socket.emit('throw-hand', move, (winner) => {
			if (winner) {
				setPhase('Result');
				if (winner === socket.id) setPlayerWin(true);
			}
		});
	};

	const renderName = () => (
		<div>
			<input
				name="name"
				placeholder="Enter Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<button onClick={handleReady}>Get Ready</button>
		</div>
	);

	return (
		<div>
			<div>
				<div>Opponent</div>
				{phase === 'Result' && <div>{opponent.move}</div>}
			</div>

			<br />

			<div>
				<div>You</div>
				{player.move && <div>{player.move}</div>}

				{phase === 'Ready' && (
					<div>
						<button onClick={() => handleMove(1)}>Rock</button>
						<button onClick={() => handleMove(2)}>Paper</button>
						<button onClick={() => handleMove(3)}>Scissors</button>
					</div>
				)}
			</div>

			<div>
				{phase === 'Result' && (
					<div>
						{playerWin ? <span>You Won!</span> : <span>You Lost!</span>}
					</div>
				)}
			</div>
		</div>
	);
};

export default Room;
