import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// 1. Define the shape of the context value
type DnDContextType = [string | null, Dispatch<SetStateAction<string | null>>];

// 2. Provide a default value matching the type
// eslint-disable-next-line @typescript-eslint/no-empty-function
const DnDContext = createContext<DnDContextType>([null, () => {}]);

// 3. Define props for the provider component
interface DnDProviderProps {
	children: ReactNode;
}

export const DnDProvider = ({ children }: DnDProviderProps) => {
	const [type, setType] = useState<string | null>(null);

	return <DnDContext.Provider value={[type, setType]}>{children}</DnDContext.Provider>;
};

// 4. Custom hook to use the context safely
export const useDnD = (): DnDContextType => {
	return useContext(DnDContext);
};

export default DnDContext;
