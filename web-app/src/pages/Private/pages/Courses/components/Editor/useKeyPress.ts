import { useEffect } from "react";

/**
 * Hook that listens for a specific key press and runs a callback.
 *
 * @param key - The key string (e.g. "Delete", "Backspace", "Enter")
 * @param callback - The function to call when the key is pressed
 */
export function useKeyPress(key: string, callback: () => void) {
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === key) {
				callback();
			}
		};

		window.addEventListener("keydown", handleKeyPress);

		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [key, callback]);
}
