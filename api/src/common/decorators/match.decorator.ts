import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "Match" })
export class MatchConstraint implements ValidatorConstraintInterface {
	validate(value: string, args: ValidationArguments) {
		const [relatedPropertyName] = args.constraints;
		const relatedValue = args.object[relatedPropertyName];

		return value === relatedValue;
	}
}

export function Match(property: string, validationOptions?: ValidationOptions) {
	return (object: object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [property],
			validator: MatchConstraint,
		});
	};
}
