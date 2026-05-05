import React, { createContext, ReactNode, useState } from "react";

// Context for managing tabs
const TabsContext = createContext<{
	activeTab: string;
	setActiveTab: (title: string) => void;
} | null>(null);

interface TabsContainerProps {
	children: ReactNode;
	addiTionalHeaderComponent?: ReactNode;
	tabContainerClassName?: string;
	tabItemClassName?: string;
	tabContentContainerClassName?: string;
	containerClassName?: string;
}

export function TabsContainer({
	children,
	addiTionalHeaderComponent,
	tabContainerClassName,
	tabItemClassName,
	tabContentContainerClassName,
	containerClassName,
}: TabsContainerProps) {
	const childrenArray = React.Children.toArray(children);
	const firstTabTitle = React.isValidElement(childrenArray[0]) ? childrenArray[0].props.title : "";

	const [activeTab, setActiveTab] = useState<string>(firstTabTitle);

	return (
		<TabsContext.Provider value={{ activeTab, setActiveTab }}>
			<div className={`w-full ${containerClassName ?? ""}`}>
				<div className="flex justify-between items-center">
					<div className={`flex ${tabContainerClassName ?? ""}`}>
						{React.Children.map(children, (child) =>
							React.isValidElement(child) ? (
								<button
									key={child.props.title}
									className={`text-[14px] text-nowrap px-4 py-3 font-medium transition-all ${
										activeTab === child.props.title
											? "border-b-2 border-primary-blue text-primary-gray"
											: "border-b-2 border-transparent text-primary-gray-lighter hover:text-primary-gray"
									} ${tabItemClassName ?? ""}`}
									onClick={() => setActiveTab(child.props.title)}
								>
									{child.props.title}
								</button>
							) : null
						)}
					</div>
					{React.isValidElement(addiTionalHeaderComponent) ? addiTionalHeaderComponent : <></>}
				</div>

				<div className={`mt-6 ${tabContentContainerClassName ?? ""}`}>
					{React.Children.map(children, (child) =>
						React.isValidElement(child) && child.props.title === activeTab
							? child.props.children
							: null
					)}
				</div>
			</div>
		</TabsContext.Provider>
	);
}

interface TabProps {
	title: string;
	children: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Tab({ title, children }: TabProps) {
	return <>{children}</>;
}
