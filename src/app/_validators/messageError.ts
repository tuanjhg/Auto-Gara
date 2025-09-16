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
    if (errors['minlength']) {
        return `${label} must greater than ${errors['minlength'].requiredLength} characters.`;
    }
    if (errors['maxlength']) {
        return `${label} must less than ${errors['maxlength'].requiredLength} characters.`;
    }
    if (errors['pattern']) {
        return `Invalid format ${label}.`;
    }
    return null;
}

export function shouldShowError(c: AbstractControl | null): boolean {
    return !!c && c.invalid && (c.dirty || c.touched) && !c.pending;
}
