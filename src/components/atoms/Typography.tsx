import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'muted';
  as?: React.ElementType;
}

export function Typography({ className, variant = 'p', as, ...props }: TypographyProps) {
  const Component =
    as || ((['h1', 'h2', 'h3', 'h4', 'p'].includes(variant) ? variant : 'p') as React.ElementType);

  return (
    <Component
      className={cn(
        {
          'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl': variant === 'h1',
          'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0':
            variant === 'h2',
          'scroll-m-20 text-2xl font-semibold tracking-tight': variant === 'h3',
          'scroll-m-20 text-xl font-semibold tracking-tight': variant === 'h4',
          'leading-7 [&:not(:first-child)]:mt-6': variant === 'p',
          'text-sm font-medium leading-none': variant === 'small',
          'text-sm text-muted-foreground': variant === 'muted',
        },
        className
      )}
      {...props}
    />
  );
}
