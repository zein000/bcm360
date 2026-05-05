import { useEffect } from "react";

export function usePageTitle(title: string) {
	useEffect(() => {
		const titleElement = document.getElementById("page-title");

		if (titleElement) {
			titleElement.textContent = title;
		}
	}, [title]);
}
