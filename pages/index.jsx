import { useState } from 'react';
import { useRouter } from 'next/router';
import generateRoom from '../utils/generateRoom';

import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';

const Home = () => {
	const router = useRouter();
	const [activeRooms, setActiveRooms] = useState([]);

	const handleRoomCreate = () => {
		let roomID;
		let currentRooms = activeRooms;

		do {
			roomID = generateRoom();
			currentRooms.push(roomID);
		} while (!currentRooms.includes(roomID));

		setActiveRooms(currentRooms);
		router.push(roomID);
	};

	const handleRoomJoin = () => {
		router.push('join');
	};

	return (
		<>
			<Head>
				<title>Rock-Paper-Scissors || Home</title>
			</Head>

			<main className={styles.main}>
				<div className={styles.container}>
					<Header />

					<div className={styles.innerContent}></div>

					<div className={styles.buttons}>
						<button className={styles.button} onClick={handleRoomCreate}>
							Create Room
						</button>

						<button className={styles.button} onClick={handleRoomJoin}>
							Join Room
						</button>
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
