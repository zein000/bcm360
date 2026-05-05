// hooks/useUndoRedo.ts
import { useState, useRef } from "react";

export function useUndoRedo<T>(initialValue: T) {
	const [value, setValue] = useState<T>(initialValue);
	const undoStack = useRef<T[]>([]);
	const redoStack = useRef<T[]>([]);

	const set = (newValue: T | ((prev: T) => T)) => {
		undoStack.current.push(value);

		const updatedValue =
			typeof newValue === "function" ? (newValue as (prev: T) => T)(value) : newValue;

		setValue(updatedValue);
		redoStack.current = [];
	};

	const undo = () => {
		if (undoStack.current.length === 0) {
			return;
		}

		const prev = undoStack.current.pop()!;

		redoStack.current.push(value);
		setValue(prev);
	};

	const redo = () => {
		if (redoStack.current.length === 0) {
			return;
		}

		const next = redoStack.current.pop()!;

		undoStack.current.push(value);
		setValue(next);
	};

	const canUndo = undoStack.current.length > 0;
	const canRedo = redoStack.current.length > 0;

	return { value, set, undo, redo, canUndo, canRedo };
}
