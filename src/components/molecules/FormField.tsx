import type { InputHTMLAttributes } from 'react';
import { Input } from '../atoms/Input';
import { Typography } from '../atoms/Typography';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, id, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <Input id={id} {...props} className={error ? 'border-red-500' : ''} />
      {error && <Typography variant="muted" className="text-red-500 text-xs mt-1">{error}</Typography>}
    </div>
  );
}
