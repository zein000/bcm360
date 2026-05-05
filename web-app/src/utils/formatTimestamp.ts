export const formatTimestamp = (timestamp: number) => {
	const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		timeZone: userTimezone,
	}).format(new Date(timestamp));

	return formattedDate;
};
