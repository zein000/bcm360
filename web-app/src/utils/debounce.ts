export function debounce(fn: Function, delay: number) {
	let timeout: ReturnType<typeof setTimeout>;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function (...args: any[]) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
}
