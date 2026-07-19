import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function GoldButton({ children, size = 'md', loading, className = '', ...props }: GoldButtonProps) {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`btn-gold ${sizeClasses[size]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-[#06080d] border-t-transparent rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
