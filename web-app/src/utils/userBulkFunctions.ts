import { useState } from "react";

export const useBulkFunctions = () => {
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [selectAll, setSelectAll] = useState<boolean>(false);

	const toggleSelectAll = () => {
		setSelectAll((prevSelectAll) => {
			if (prevSelectAll) {
				setSelectAll(false);

				return false;
			} else {
				setSelectAll(true);

				return true;
			}
		});
	};

	const handleSelectAll = (items: number[]) => {
		setSelectedItems(items);
	};

	const handleSelectItem = (item: number) => {
		setSelectedItems((prevSelectedItems) => {
			if (prevSelectedItems.includes(item)) {
				return prevSelectedItems.filter((selectedItem) => selectedItem !== item);
			} else {
				return [...prevSelectedItems, item];
			}
		});
	};

	return {
		selectedItems,
		selectAll,
		handleSelectAll,
		handleSelectItem,
		toggleSelectAll,
	};
};
