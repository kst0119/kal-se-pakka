import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5
        ${hoverEffect ? 'transition-all duration-200 hover:border-slate-700 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : 'shadow-card'}
        ${glow ? 'ring-1 ring-indigo-500/30 shadow-glow-purple' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

