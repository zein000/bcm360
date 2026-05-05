export function formatDateRange(start: Date | string, end: Date | string): string {
	if (!start || !end) {
		return "";
	}

	const startDate = typeof start === "string" ? new Date(start) : start;
	const endDate = typeof end === "string" ? new Date(end) : end;

	if (isNaN(startDate?.getTime()) || isNaN(endDate?.getTime())) {
		return "";
	}

	const isSameDay = startDate.toDateString() === endDate.toDateString();

	const formatDate = (date: Date) => {
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${day}.${month}.${year}`;
	};

	const formatTime = (date: Date) =>
		date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

	if (isSameDay) {
		return `${formatDate(startDate)} ${formatTime(startDate)} - ${formatTime(endDate)}`;
	} else {
		return `${formatDate(startDate)} - ${formatDate(endDate)}`;
	}
}
