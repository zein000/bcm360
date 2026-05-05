import { FunctionComponent } from "react";
import { Stack } from "@mui/material";

import { Chip } from "@/components";
import { ChipsListItem } from "@/schemas/chips";

interface ChipsListProps {
	selectedItems: ChipsListItem[];
	handleDelete: (identifier: string) => void;
}

export const ChipsList: FunctionComponent<ChipsListProps> = ({ selectedItems, handleDelete }) => {
	return (
		<Stack direction="row" flexWrap="wrap" gap={2}>
			{selectedItems.map(({ id, identifier, color, name }) => (
				<Chip key={id} color={color} handleDelete={() => handleDelete(identifier)} label={name} />
			))}
		</Stack>
	);
};
