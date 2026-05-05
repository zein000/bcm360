/**
 * Funktion: getRandomSpecials
 *
 * Gibt ein Array mit einer bestimmten Anzahl zufälliger Sonderzeichen zurück.
 *
 * @param number - Anzahl der zu generierenden Sonderzeichen
 * @returns Array von Strings (Sonderzeichen)
 */
export const getRandomSpecials = (number: number): string[] =>
	Array(number)
		.fill("")
		.map(() => ["#", "$", "%", "&", "*"][Math.floor(Math.random() * 5)]);

/**
 * Funktion: getRandomDigits
 *
 * Gibt ein Array mit einer bestimmten Anzahl zufälliger Ziffern zurück.
 *
 * @param number - Anzahl der zu generierenden Ziffern
 * @returns Array von Strings (Zahlen von 0–9)
 */
export const getRandomDigits = (number: number): string[] =>
	Array(number)
		.fill("")
		.map(() => Math.floor(Math.random() * 10).toString());

/**
 * Funktion: getRandomChars
 *
 * Gibt ein Array mit einer bestimmten Anzahl zufälliger Buchstaben zurück.
 * Buchstaben sind gemischt (Groß- und Kleinbuchstaben).
 *
 * @param number - Anzahl der zu generierenden Buchstaben
 * @returns Array von Einzelbuchstaben
 */
export const getRandomChars = (number: number): string[] =>
	Array(number)
		.fill("")
		.map(
			() =>
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("")[
					Math.floor(Math.random() * 52)
				]
		);

/**
 * Funktion: randomizeArray
 *
 * Mischt die Elemente eines Arrays zufällig.
 * Wird rekursiv aufgebaut, um alle Elemente neu zu ordnen.
 *
 * @param array - Das Eingabe-Array
 * @param newArray - (intern) temporäres Array für das Ergebnis
 * @returns Zufällig neu sortiertes Array
 */
export const randomizeArray = (array: any[], newArray: any[] = []): any[] => {
	const arrayCopy = [...array];
	const randomElement = arrayCopy.splice(Math.floor(Math.random() * arrayCopy.length), 1);

	newArray.push(randomElement[0]);

	if (arrayCopy.length === 0) {
		return newArray;
	}

	return randomizeArray(arrayCopy, newArray);
};
