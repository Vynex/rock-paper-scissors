import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

import Move from '../components/move';
import styles from '../styles/Home.module.css';

let socket;

const playerState = { id: '', name: '', move: '' };

const Room = () => {
	const router = useRouter();
	let { room } = router.query;

	const [phase, setPhase] = useState('Waiting');

	const [player, setPlayer] = useState(playerState);
	const [opponent, setOpponent] = useState(playerState);

	const [result, setResult] = useState(false);

	const cleanUp = () => {
		socket.disconnect();
	};

	useEffect(() => {
		if (room && room.length !== 4) router.push('/');
	}, [room, router]);

	useEffect(() => {
		fetch(`${location.protocol + '//' + location.host}/api/socket`);
		socket = io();

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

			user.id = user.id;
			user.name = 'Player 2';
			user.move = '';

			setOpponent(user);
		});

		socket.on('hand-thrown', (move) => {
			setOpponent((opp) => ({ ...opp, move: move }));
		});

		socket.on('game-finished', (result) => {
			setPhase('Result');
			setResult(result);
		});

		window.addEventListener('beforeunload', cleanUp);

		return () => {
			window.removeEventListener('beforeunload', cleanUp);
		};
	}, []);

	useEffect(() => {
		socket.on('room-full', (roomID) => {
			console.log(`Room ID ${roomID.toUpperCase()} is Full.`);
			router.push('/');
		});
	}, [router]);

	useEffect(() => {
		if (room)
			socket.emit('join-room', room.toUpperCase(), (users) => {
				if (users.length === 2) {
					const user = {
						id: users[0].user,
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

	const handleLeave = () => {
		cleanUp();
		router.back();
	};

	const handleRoomCopy = () => {
		const link = `${location.protocol + '//' + location.host}/${room.toUpperCase()}`;
		navigator.clipboard.writeText(link);
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
		socket.emit('throw-hand', move, (result) => {
			if (result) {
				setPhase('Result');
				setResult(result);
			}
		});
	};

	const renderResult = () => (
		<div>
			{phase === 'Result' && (
				<>
					<div>
						{result.winner === player.id && <span>You Won!</span>}
						{result.winner === opponent.id && <span>You Lost!</span>}
						{result.winner === null && <span>Game Tied!</span>}
					</div>
				</>
			)}
		</div>
	);

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.shareText}>Click to Share this Room</div>
					<div className={styles.roomCode} onClick={handleRoomCopy}>
						{room?.toUpperCase()}
					</div>
				</div>

				<div className={styles.innerContent}>
					<div className={styles.gameArea}>
						<div className={styles.opponentArea}>
							{phase === 'Result' && (
								<div className={styles.finalMove}>
									<Move move={opponent.move} result />
								</div>
							)}
						</div>

						<div className={styles.versus}>
							<div className={styles.playerTitle}>Opponent</div>
							<div>
								{phase === 'Result' ? renderResult() : <span>Vs.</span>}
							</div>
							<div className={styles.playerTitle}>You</div>
						</div>

						<div className={styles.playerArea}>
							<div>
								{phase === 'Result' && (
									<div className={styles.finalMove}>
										<Move move={player.move} result />
									</div>
								)}

								{phase === 'Ready' && (
									<div className={styles.moves}>
										<div
											className={styles.move}
											onClick={() => handleMove(1)}
										>
											<Move move="Rock" />
										</div>
										<div
											className={styles.move}
											onClick={() => handleMove(2)}
										>
											<Move move="Paper" />
										</div>
										<div
											className={styles.move}
											onClick={() => handleMove(3)}
										>
											<Move move="Scissors" />
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className={styles.buttons}>
					<button className={styles.button} onClick={handleLeave}>
						Leave Room
					</button>
				</div>
			</div>
		</main>
	);
};

export default Room;
