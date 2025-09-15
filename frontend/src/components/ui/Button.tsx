import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md';

const base = 'inline-flex items-center justify-center rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none';
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm'
};
const variants: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600',
  secondary: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 focus:ring-gray-300',
  danger: 'border border-red-300 text-red-600 hover:bg-red-50 bg-white focus:ring-red-400',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

export default function Button({ variant = 'primary', size = 'md', iconLeft, iconRight, className = '', children, ...rest }: Props) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
}