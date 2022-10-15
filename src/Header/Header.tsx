import { FC } from 'react';
import { HeaderProps } from '.';
import styles from './Header.module.css';
import logo from './assets/troll-face.svg';

export const Header: FC<HeaderProps> = (props) => {
	return (
		<header className={styles.header} {...props}>
			<img className={styles.logo} src={logo} alt="logo" />
			<h2 className={styles.title}>Meme Generator</h2>
			<h4 className={styles.projectTitle}>React Course - Project 3</h4>
		</header>
	)
};
