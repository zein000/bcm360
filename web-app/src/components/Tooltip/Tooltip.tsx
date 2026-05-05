import { FunctionComponent, ReactNode, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface TooltipProps {
	children: ReactNode;
	content: ReactNode | string;
}

export const Tooltip: FunctionComponent<TooltipProps> = ({ children, content }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const tooltipRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isVisible && triggerRef.current && tooltipRef.current) {
			const triggerRect = triggerRef.current.getBoundingClientRect();
			const tooltipRect = tooltipRef.current.getBoundingClientRect();

			setPosition({
				top: triggerRect.top - tooltipRect.height - 8 + window.scrollY,
				left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + window.scrollX,
			});
		}
	}, [isVisible]);

	return (
		<>
			<div
				ref={triggerRef}
				className="group inline-flex relative z-100"
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
			>
				{children}
			</div>
			{isVisible &&
				ReactDOM.createPortal(
					<div
						ref={tooltipRef}
						className="absolute max-w-[310px] p-2 bg-white border rounded shadow-lg z-[150] transition-opacity text-sm"
						style={{
							top: position.top,
							left: position.left,
						}}
					>
						{content}
					</div>,
					document.body
				)}
		</>
	);
};
