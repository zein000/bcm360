declare global {
	interface String {
		capitalizeString(): string;
	}
}

String.prototype.capitalizeString = function () {
	return this.charAt(0).toUpperCase() + this.slice(1)?.toLowerCase();
};

export {};
