import { useRouter } from 'next/router';
import { useState } from 'react';

const Join = () => {
	const router = useRouter();
	const [roomID, setRoomID] = useState('');

	const handleClick = () => {
		router.push(roomID);
	};

	return (
		<div>
			<div>
				<input
					placeholder="Room ID"
					value={roomID}
					onChange={(e) => setRoomID(e.target.value)}
				/>
			</div>

			<div>
				<button onClick={handleClick}>Join Room</button>
			</div>
		</div>
	);
};

export default Join;
