import { CircularProgress } from "@mui/material";

interface ICardLayout {
	children: React.ReactNode;
	className?: string;
	isLoading?: boolean;
}

export default function CardLayout({ children, className, isLoading }: ICardLayout) {
	return (
		<div className={`rounded-[20px] border border-[#E6E6EC] p-6 ${className}`}>
			{isLoading ? (
				<div className="w-full p-2 flex items-center justify-center">
					<CircularProgress />
				</div>
			) : (
				children
			)}
		</div>
	);
}
