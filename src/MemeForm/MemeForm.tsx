import { FC, useEffect, useState, useRef } from 'react';
import { MemeFormProps } from '.';
import memeData from './memesData';
import styles from './MemeForm.module.css';

export const MemeForm: FC<MemeFormProps> = (props) => {
	const [meme, setMeme] = useState({
		topText: '',
		bottomText: '',
		randomeImage: ''
	});
	const [allMemes, setAllMemes] = useState([])
	const dataFetchedRef = useRef(false);

	useEffect(() => {
		if (dataFetchedRef.current) return;

		dataFetchedRef.current = true;

		fetch(`https://api.imgflip.com/get_memes`)
			.then(res => res.json())
			.then(data => setAllMemes(data.data.memes))
	}, []);

	function getRandomeMemeImage(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		let randomImageUrl: string = allMemes[Math.floor(Math.random() * memeData.data.memes.length)].url;
		setMeme(prevMeme => ({
			...prevMeme,
			randomeImage: randomImageUrl
		}));
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;

		setMeme(prevMeme => ({
			...prevMeme,
			[name]: value
		}));
	}

	return (
		<main className={styles.wrap}>
			<form className={styles.form} action="" method="post">
				<fieldset className={styles.fieldset}>
					<input className={styles.input} type="text" placeholder="Upper text" name='topText' value={meme.topText} onChange={handleChange} />
					<input className={styles.input} type="text" placeholder='Below text' name='bottomText' value={meme.bottomText} onChange={handleChange} />
				</fieldset>
				<p>
					<button onClick={getRandomeMemeImage} className={styles.button} type="submit">
						<span>Get a new meme image</span>
						<span className={styles.buttonIcon}>🖼</span>
					</button>
				</p>
			</form>
			<div>
				<figure className={styles.memeImage}>
					{meme.topText.length ? <h2 className={`${styles.memeText} ${styles.memeTextTop}`}>{meme.topText}</h2> : null}
					{meme.bottomText.length ? <h2 className={`${styles.memeText} ${styles.memeTextBottom}`}>{meme.bottomText}</h2> : null}
					{meme.randomeImage.length ? <img src={meme.randomeImage} alt="meme image" /> : <figcaption>To get a meme, click the button ⇡</figcaption>}
				</figure>
			</div>
		</main>
	);
};
