import React, { CSSProperties, ReactElement, RefObject } from "react";

export interface DragMoveProps {
	onPointerDown?: React.PointerEventHandler<HTMLDivElement>,
	onPointerUp?: EventListener,
	onPointerMove?: React.PointerEventHandler<HTMLDivElement>,
	containerRef: RefObject<HTMLDivElement>,
	children?: ReactElement,
};
