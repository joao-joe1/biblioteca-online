import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'PhoneNumber', async: false })
export class PhoneNumberValidator implements ValidatorConstraintInterface {
    validate(telefone: string, args: ValidationArguments) {
        const telefonePattern = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return telefonePattern.test(telefone);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Informe um número de telefone válido no formato (DDD) XXXX-XXXX.';
    }
}
