import { FC, MouseEvent, useState } from 'react';
import { MemeFormProps } from '.';
import memeData from './memesData';
import styles from './MemeForm.module.css';

export const MemeForm: FC<MemeFormProps> = (props) => {
	let [memeImage, setMemeImagem] = useState('');

	function getMemeImage(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		let randomImageUrl: string = memeData.data.memes[Math.floor(Math.random() * memeData.data.memes.length)].url;
		setMemeImagem(randomImageUrl)
		console.log('Button was clicked');
		console.log(randomImageUrl);
	}

	return (
		<main className={styles.wrap}>
			<form className={styles.form} action="" method="post">
				<fieldset className={styles.fieldset}>
					<input className={styles.input} type="text" placeholder="Upper text" />
					<input className={styles.input} type="text" placeholder='Below text' />
				</fieldset>
				<p>
					<button onClick={getMemeImage} className={styles.button} type="submit">
						<span>Get a new meme image</span>
						<span className={styles.buttonIcon}>🖼</span>
					</button>
				</p>
			</form>
			<div>
				<figure className={styles.imageWrap}>
					{memeImage.length ? <img src={memeImage} alt="meme image" /> : <figcaption>To get a meme, click the button ⇡</figcaption>}
				</figure>
			</div>
		</main>
	);
};
