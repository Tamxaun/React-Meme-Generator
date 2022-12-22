import { FC, useEffect, useState, useRef } from 'react';
import { MemeFormProps } from '.';
import memeData from './memesData';
import styles from './MemeForm.module.css';
import { DragMove } from '../DragMove';

interface Meme {
	id: string;
	name: string;
	url: string;
	width: number;
	height: number;
	box_count: number;
	captions: number;
}

export const MemeForm: FC<MemeFormProps> = (props) => {
	const [meme, setMeme] = useState({
		topText: '',
		bottomText: '',
		randomeImage: ''
	});
	const [allMemes, setAllMemes] = useState<Meme[]>([]);
	const dataFetchedRef = useRef(false);
	const dragAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (dataFetchedRef.current) return;

		dataFetchedRef.current = true;

		fetch(`https://api.imgflip.com/get_memes`)
			.then(res => res.json())
			.then(data => setAllMemes(data.data.memes));
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

	function handleDownloadMeme(e: React.MouseEvent) {
		e.preventDefault();

		const { current: container } = dragAreaRef;

		if (!container || !meme.randomeImage) return;

		const { width: memeWidth, height: memeHeight } = container.getBoundingClientRect();

		const canvas = document.createElement('canvas');
		canvas.style.setProperty('display', 'none');
		const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;

		if (!ctx) throw new Error('Failed to get 2D context');

		const img = new Image();

		canvas.id = "canvas-meme";
		canvas.width = Math.round(memeWidth);
		canvas.height = Math.round(memeHeight);

		const body = document.getElementsByTagName("main")[0];
		body.appendChild(canvas);

		img.crossOrigin = 'Anonymous';
		img.src = meme.randomeImage;
		img.onload = async () => {
			ctx.drawImage(img, 0, 0, Math.round(memeWidth), Math.round(memeHeight));

			new Promise(() => {
				ctx.drawImage(img, 0, 0, Math.round(memeWidth), Math.round(memeHeight));

				if (!!meme.topText.length || !!meme.bottomText.length) {
					const boxesText = container.children as HTMLCollectionOf<HTMLElement>;

					ctx.font = "32px impact, sans-serif";
					ctx.textAlign = "start";
					ctx.fillStyle = "white";
					ctx.lineWidth = 4;
					ctx.lineJoin = "round";
					ctx.shadowColor = "hsla(0, 0%, 0%, 0.4)";
					ctx.shadowBlur = 3;
					ctx.shadowOffsetY = 2;
					ctx.shadowOffsetX = 2;

					for (let index = 0; index < boxesText.length; index++) {
						const element = boxesText[index];

						if (element.localName !== 'div') return;

						const cordsElement = element.getBoundingClientRect();
						const cordsContainer = container.getBoundingClientRect();
						const elementText = element.innerText;
						const elementBaseX = 20 + 1;
						const elementBaseY = 20 + (cordsElement.height / 2.725);
						const elementXPos = (cordsElement.left - cordsContainer.left) + elementBaseX;
						const elementYPos = (cordsElement.top - cordsContainer.top) + elementBaseY;

						ctx.strokeText(elementText, elementXPos, elementYPos);
						ctx.fillText(elementText, elementXPos, elementYPos);
					}
				}
			});

			const link = document.createElement('a');
			const canvasMemeUrl = canvas.toDataURL("image/png", 1.0);

			link.href = canvasMemeUrl;
			link.download = "meme";
			link.click();
			link.remove();
			canvas.remove();
		}
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
					<button onClick={handleDownloadMeme}>
						Download
					</button>
				</p>
			</form>
			<div ref={dragAreaRef} className={styles.memeImageWrap}>
				{meme.topText.length ?
					<DragMove
						containerRef={dragAreaRef}
					>
						<h2
							className={`${styles.memeText}`}
						>
							{meme.topText}
						</h2>
					</DragMove>
					: null}
				{meme.bottomText.length ?
					<DragMove
						containerRef={dragAreaRef}
					>
						<h2 className={`${styles.memeText} ${styles.memeTextBottom}`}>{meme.bottomText}</h2>
					</DragMove>
					: null}
				<figure className={styles.memeImage}>
					{meme.randomeImage.length ? <img src={meme.randomeImage} alt="meme image" /> : <figcaption>To get a meme, click the button ⇡</figcaption>}
				</figure>
			</div >
		</main >
	);
};
