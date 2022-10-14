import { FC } from 'react';
import { HeaderProps } from '.';
import styles from './Header.module.css';
import logo from './assets/troll-face.svg';

export const Header: FC<HeaderProps> = (props) => {
	return (
		<header className={styles.wrapper} {...props}>
			<div className={styles.logoWrapper}>
				<img className={styles.logo} src={logo} alt="logo" />
				<h1 className={styles.title}>Meme Generator</h1>
			</div>
			<h3 className={styles.subTitle}>React Course - Project 3</h3>
		</header>
	)
};
