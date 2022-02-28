import { useRouter } from 'next/router';
import { useState } from 'react';
import generateRoom from '../utils/generateRoom';

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
		<div>
			<div>
				<button onClick={handleRoomCreate}>Create Room</button>
			</div>

			<div>
				<button onClick={handleRoomJoin}>Join Room</button>
			</div>
		</div>
	);
};

export default Home;
