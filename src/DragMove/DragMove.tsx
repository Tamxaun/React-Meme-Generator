import { useEffect, useRef, useState, type FC } from 'react';
import { DragMoveProps } from '.';
import styles from './DragMove.module.css';

export const DragMove: FC<DragMoveProps> = (props) => {
	const {
		onPointerDown = () => { },
		onPointerUp = () => { },
		onPointerMove = () => { },
		containerRef,
		children
	} = props;

	const [dragInfo, setDragInfo] = useState({
		top: 0,
		left: 0,
		width: 0,
		height: 0
	});
	const [isDragging, setIsDragging] = useState(false);
	const [translate, setTranslate] = useState({ x: 0, y: 0 });
	const targetRef = useRef<HTMLDivElement>(null);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.preventDefault();

		const { current: draggableElement } = targetRef;

		if (!draggableElement) return;

		const {
			top,
			left,
			width,
			height
		} = draggableElement.getBoundingClientRect();


		setIsDragging(true);
		setDragInfo({
			top,
			left,
			width,
			height
		});

		onPointerDown(e);
	}
	const handlePointerUp: EventListener = (e: Event) => {
		e.preventDefault();

		setIsDragging(false);

		onPointerUp(e);
	}
	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const { current: containerDragElement } = containerRef;

		if (!isDragging || !containerDragElement) return;

		e.preventDefault();

		const { clientX, clientY, movementX, movementY } = e;

		const {
			left,
			right,
			top,
			bottom
		} = containerDragElement.getBoundingClientRect();

		if (
			clientX > (left + (dragInfo.width / 3)) &&
			clientX < (right - (dragInfo.width / 3)) &&
			clientY > (top + (dragInfo.height / 3)) &&
			clientY < (bottom - (dragInfo.height / 3))
		) {
			setTranslate({
				x: translate.x + movementX,
				y: translate.y + movementY
			})
		}

		onPointerMove(e);
	};
	const handleResize = () => {
		const { current: container } = containerRef;
		const { current: dragElement } = targetRef;

		if (!dragElement || !container) return;

		const cordsContainer = container.getBoundingClientRect();
		const cordDragElement = dragElement.getBoundingClientRect();
		const isInBounding =
			cordDragElement &&
			cordsContainer &&
			cordDragElement?.left > cordsContainer?.left &&
			cordDragElement?.right < cordsContainer?.right &&
			cordDragElement?.top > cordsContainer?.top &&
			cordDragElement?.bottom < cordsContainer?.bottom;

		if (!isInBounding) {
			setTranslate(prev => ({
				x: Math.min(Math.max(0, prev.x), cordsContainer.width - cordDragElement.width),
				y: Math.min(Math.max(0, prev.y), cordsContainer.height - cordDragElement.height),
			}));
		}
	}
	const containerResizeObserver = new ResizeObserver(handleResize);

	useEffect(() => {
		console.log("useEffect");
		const { current: container } = containerRef;

		if (!container) return;

		container.addEventListener('pointerup', handlePointerUp);
		container.addEventListener('pointerleave', handlePointerUp);
		containerResizeObserver.observe(container);

		return () => {
			container.removeEventListener('pointerup', handlePointerUp);
			container.removeEventListener('pointerleave', handlePointerUp);
			containerResizeObserver.disconnect();
		}
	}, []);

	return (

		<div
			ref={targetRef}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			className={styles.wrapper}
			style={{ transform: `translate(${translate.x}px,${translate.y}px)` }
			}
		>
			{children}
		</div >
	);
};