import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', glow = false, onClick }: GlassCardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 ${glow ? 'glass-card-glow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
