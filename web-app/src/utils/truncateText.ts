export const truncateText = (text = "", maxLength = 200) => {
	if (!text) {
		return "";
	}

	if (text?.length <= maxLength) {
		return text;
	}

	return text.slice(0, maxLength).trim() + "...";
};
