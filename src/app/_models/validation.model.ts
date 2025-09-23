export interface ValidationStringOpts {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pattern?: any;
}
export interface ValidationNumberOpts {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    integer?: boolean;
    realNumber?: boolean;
    phone?: boolean;
}
