import { validationString } from '../string.validation';
import { validationNumber } from '../number.validation';
import { FormSchema } from './form-schema';

export const VehicleSchema: FormSchema = {
  tenant_id: {
    validators: [...validationNumber({ required: true, integer: true })],
    defaultValue: ''
  },
  customer_id: {
    validators: [...validationNumber({ required: true, integer: true })],
    defaultValue: ''
  },
  plate_number: {
    validators: validationString({ required: true, minLength: 5, maxLength: 20 }),
    defaultValue: ''
  },
  vin_number: {
    validators: validationString({ minLength: 10, maxLength: 20 }),
    defaultValue: ''
  },
  make: {
    validators: validationString({ required: true }),
    defaultValue: ''
  },
  model: {
    validators: validationString({ required: true }),
    defaultValue: ''
  },
  year: {
    validators: validationNumber({ required: true, min: 1900, max: 2100, integer: true }),
    defaultValue: ''
  },
  color: {
    validators: [],
    defaultValue: ''
  },
  last_mileage: {
    validators: validationNumber({ required: true, min: 0, integer: true }),
    defaultValue: ''
  }
};
