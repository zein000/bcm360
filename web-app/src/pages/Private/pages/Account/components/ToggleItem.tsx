import { Card, CardContent, Unstable_Grid2 as Grid, Typography, Switch } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { FunctionComponent, ReactElement } from "react";

import { LoadingOverlay } from "@/components";

export interface ToggleItemProps {
	isLoading: boolean;
	label: string;
	name: string;
	description: string;
	value: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	Icon?: ReactElement;
}

export const ToggleItem: FunctionComponent<ToggleItemProps> = ({
	isLoading,
	label,
	name,
	description,
	value,
	onChange,
	Icon,
}) => {
	return (
		<Card>
			<CardContent>
				<Grid container spacing={3}>
					<Grid md={4} xs={12}>
						<Typography variant="h6">{name}</Typography>
					</Grid>

					<Grid md={8} xs={12}>
						<Stack spacing={3}>
							{isLoading && <LoadingOverlay />}
							<Stack alignItems="center" direction="row" spacing={2}>
								<Box width="100%">
									<Typography variant="subtitle1">{label}</Typography>

									<Typography color="neutral.500" variant="body1">
										<span className="inline-flex items-center">
											{Icon}
											<span>{description} </span>
										</span>
									</Typography>
								</Box>

								<Switch checked={value} color="primary" onChange={onChange} />
							</Stack>
						</Stack>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};
