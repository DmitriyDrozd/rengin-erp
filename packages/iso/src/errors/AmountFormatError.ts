import {YPError} from './PrintmanError';

export default class AmountFormatError extends YPError {
    constructor(actualValue) {
        super("Amount must be a positive number and have at most 7 digits after the decimal, defined amount: " + actualValue);
    }
}
