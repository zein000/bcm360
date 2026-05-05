import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
export declare class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments): boolean;
}
export declare function Match(property: string, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
