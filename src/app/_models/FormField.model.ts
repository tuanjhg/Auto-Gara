export interface FormField {
  name: string;
  controlName?: string;
  label: string;
  type: 'text' | 'number' | 'tel' | 'select' | 'textarea' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  colspan?: number;
  section: 'vehicle' | 'owner' | 'status';
}
export interface FormSection {
  title: string;
  fields: FormField[];
}
export interface TableColumn {
  key: string;
  label: string;
  className?: string;
  sortable?: boolean;
}
