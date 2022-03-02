import Image from 'next/image';
import { useState } from 'react';

const Move = ({ move, result }) => {
	const [size] = useState(result ? 75 : 56);

	const setImage = (move) => {
		let path;

		switch (move) {
			case 'Rock':
				path = '/assets/icons/Rock.png';
				break;
			case 'Paper':
				path = '/assets/icons/Paper.png';
				break;
			case 'Scissors':
				path = '/assets/icons/Scissors.png';
				break;
		}

		return path;
	};

	const [path, setPath] = useState(setImage(move));

	return <Image src={path} alt={move} height={size} width={size} />;
};

export default Move;
