/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function getErrorMessage(nameControl: AbstractControl, label: string): string {
    if (!nameControl || nameControl.pending || nameControl.valid) {
        return null;
    }
    const errors: ValidationErrors = nameControl.errors;
    if (errors['required']) {
        return `${label} is require.`;
    }
    if (errors['email']) {
        return `${label} is invalid.`;
    }
    if (errors['min']) {
        return `${label} must greater than ${errors['min'].min}.`;
    }
    if (errors['max']) {
        return `${label} must less than ${errors['max'].max}.`;
    }
    if (errors['minlength']) {
        return `${label} must greater than ${errors['minlength'].requiredLength} characters.`;
    }
    if (errors['maxlength']) {
        return `${label} must less than ${errors['maxlength'].requiredLength} characters.`;
    }
    if (errors['pattern']) {
        return `Invalid format ${label}.`;
    }
    if (errors['passwordMismatch']) {
        return 'Passwords do not match.';
    }
    if (errors['invalidUsername']) {
        return `${label} can only contain letters, numbers, dots, underscores and hyphens.`;
    }
    if (errors['invalidPhoneNumber']) {
        return `${label} is not a valid phone number.`;
    }
    return null;
}

export function shouldShowError(c: AbstractControl | null): boolean {
    return !!c && c.invalid && (c.dirty || c.touched) && !c.pending;
}
