import { useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';

const Join = () => {
	const router = useRouter();
	const [roomID, setRoomID] = useState('');

	const handleChange = (e) => {
		setRoomID(e.target.value.toUpperCase());
	};

	const handleClick = () => {
		router.push(roomID);
	};

	return (
		<>
			<Head>
				<title>Rock-Paper-Scissors || Join</title>
			</Head>

			<main className={styles.main}>
				<div className={styles.container}>
					<Header />

					<section className={styles.innerContent}>
						<input
							placeholder="Room ID"
							value={roomID}
							onChange={handleChange}
							maxLength={4}
						/>
					</section>

					<div className={styles.buttons}>
						<button className={styles.button} onClick={handleClick}>
							Join Room
						</button>
						<button
							className={styles.button}
							onClick={() => router.back()}
						>
							Go Back
						</button>
					</div>
				</div>
			</main>
		</>
	);
};

export default Join;
