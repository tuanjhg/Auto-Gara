// Chữ (mọi ngôn ngữ) + số + khoảng trắng
export const LETTERS_NUM_SPACE = /^[\p{L}\p{N} ]+$/u;
export const LETTERS_NUM_CODE = /^\S+$/;
export const REAL_NUMBER = /^[+-]?\d+(?:\.\d+)?$/;
export const INTEGER_NUMBER = /^[1-9]\d*$/;
export const PHONE_NUMBER = /^0\d{9,10}$/;
