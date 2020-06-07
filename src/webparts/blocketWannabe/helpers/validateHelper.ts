import { INumValidationResult } from "../interfaces/Interfaces"

export function validatePrice(value: number, min: number, max: number): INumValidationResult {

    if (value > max) {
        return {
            errorMessage: `The price can't exceed ${max} SEK.`,
            isValid: false
        };
    }

    if (value < min) {
        return {
            errorMessage: `The price can't be lower than ${min} SEK.`,
            isValid: false
        };
    }
    
    return {
        errorMessage: '',
        isValid: true
    };
}