import styles from './App.module.css';
import { Header } from "./Header";
import { MemeForm } from "./MemeForm";

function App() {
	return (
		<div className={styles.app}>
			<Header />
			<MemeForm />
		</div>
	)
}

export default App
