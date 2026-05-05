interface IBlockTitle {
	label?: string;
	component?: JSX.Element;
}

export default function BlockTitle({ label, component }: IBlockTitle) {
	return (
		<p className="w-full text-center flex items-center gap-1">
			<p className="border-b-[1px] flex-1 border-[#EAECF0]"></p>
			{label && <p className="text-[14px] text-primary-gray-lighter font-medium">{label}</p>}
			{component && component}
			<p className="border-b-[1px] flex-1 border-[#EAECF0]"></p>
		</p>
	);
}
