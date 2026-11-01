import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  accent = null, // 'coral' | 'lime'
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-charcoal-850/90 rounded-2xl border border-cream-200 dark:border-charcoal-750 p-5 sm:p-6
        text-charcoal-900 dark:text-cream-50 transition-all duration-200
        ${hoverEffect ? 'hover:border-coral-500/40 dark:hover:border-coral-500/40 hover:shadow-card-dark hover:-translate-y-0.5 cursor-pointer' : 'shadow-card-light dark:shadow-card-dark'}
        ${glow ? 'ring-1 ring-coral-500/30 shadow-coral-glow' : ''}
        ${accent === 'coral' ? 'border-l-4 border-l-coral-500' : ''}
        ${accent === 'lime' ? 'border-l-4 border-l-lime-400' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
