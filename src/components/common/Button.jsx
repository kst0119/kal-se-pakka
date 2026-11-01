import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97] select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    xs: 'text-[11px] px-2 py-1 rounded-lg gap-1',
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-sm sm:text-base px-6 py-3 rounded-2xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-coral-500 hover:bg-coral-600 text-white shadow-coral-glow focus:ring-coral-500 border border-coral-400/30',
    lime:
      'bg-lime-400 hover:bg-lime-500 text-charcoal-950 font-extrabold shadow-lime-glow focus:ring-lime-400 border border-lime-500/30',
    secondary:
      'bg-cream-200 hover:bg-cream-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-750 text-charcoal-800 dark:text-cream-100 border border-cream-300/80 dark:border-charcoal-700 focus:ring-charcoal-500 shadow-sm',
    outline:
      'bg-transparent hover:bg-cream-200/60 dark:hover:bg-charcoal-800/60 text-charcoal-700 dark:text-cream-200 border border-cream-300 dark:border-charcoal-700 focus:ring-coral-500',
    ghost:
      'bg-transparent hover:bg-cream-200/50 dark:hover:bg-charcoal-800/50 text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-cream-50 focus:ring-coral-500',
    danger:
      'bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-500/20 focus:ring-rose-500',
    success:
      'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 focus:ring-emerald-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default Button;
