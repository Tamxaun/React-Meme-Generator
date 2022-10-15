import { FC } from 'react';
import { MemeFormProps } from '.';
import styles from './MemeForm.module.css';

export const MemeForm: FC<MemeFormProps> = (props) => {
	return (
		<main className={styles.wrap}>
			<form className={styles.form} action="" method="post">
				<fieldset className={styles.fieldset}>
					<input className={styles.input} type="text" placeholder="upper text" />
					<input className={styles.input} type="text" placeholder='below text' />
				</fieldset>
				<p>
					<button className={styles.button} type="submit">
						<span>Get a new meme image</span>
						<span className={styles.buttonIcon}>🖼</span>
					</button>
				</p>
			</form>
		</main>
	);
};
