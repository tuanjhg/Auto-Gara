export interface ValidationStringOpts {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pattern?: any;
}
export interface ValidationNumberOpts {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    integer?: boolean;
    realNumber?: boolean;
}
