interface TableRowLabelProps {
	img: JSX.Element;
	title: string;
}

export default function TableRowLabel({ img, title }: TableRowLabelProps) {
	return (
		<div className="w-fit flex items-center justify-center gap-2 p-3 bg-[#F7F8FB] rounded-xl">
			{img}
			<p className="leading-none font-medium text-[14px] text-primary-gray text-wrap">{title}</p>
		</div>
	);
}
