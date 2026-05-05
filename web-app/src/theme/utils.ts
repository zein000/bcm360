import { blue, browserbite, green, indigo, purple } from "./colors";

import type { PaletteColor } from "@mui/material/styles/createPalette";
import type { ColorPreset } from "./index";

export const getPrimary = (preset?: ColorPreset): PaletteColor => {
	switch (preset) {
		case "blue":
			return blue;
		case "green":
			return green;
		case "indigo":
			return indigo;
		case "purple":
			return purple;
		case "browserbite":
			return browserbite;
		default:
			console.error(
				'Invalid color preset, accepted values: "blue", "green", "indigo" or "purple"".'
			);

			return blue;
	}
};
