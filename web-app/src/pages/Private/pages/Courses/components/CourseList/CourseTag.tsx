import { useTranslation } from "react-i18next";

export default function CourseTag({ tag, className }: { tag?: string; className?: string }) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`course.${key}`);

	return (
		<span
			className={`bg-primary-green-lighter/15 capitalize py-1 px-2 rounded-md text-primary-green-lighter text-[12px] text-nowrap font-medium ${className}`}
		>
			{tag ?? ts("no-tag")}
		</span>
	);
}
