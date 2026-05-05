import { Injectable, PipeTransform, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class TrimPipe implements PipeTransform {
	private isObj(obj: object): boolean {
		return typeof obj === "object" && obj !== null;
	}

	private trim(value: object) {
		Object.keys(value).forEach((key: string) => {
			if (key !== "password" && key !== "oldPassword" && key !== "confirmPassword") {
				if (this.isObj(value[key])) {
					value[key] = this.trim(value[key]);
				} else {
					if (typeof value[key] === "string") {
						value[key] = value[key].trim();
					}
				}
			}
		});

		return value;
	}

	transform(value: never, metadata: ArgumentMetadata) {
		const { type } = metadata;

		if (this.isObj(value) && type === "body") {
			return this.trim(value);
		}

		return value;
	}
}
