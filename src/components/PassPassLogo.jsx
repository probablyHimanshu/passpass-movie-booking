import React from 'react';

export function PassPassLogo({ className = 'h-10', imgClassName = '' }) {
  return (
    <div className="inline-flex items-center select-none">
      <img
        src="/passpass-logo.png"
        alt="Pass Pass"
        className={`${className} ${imgClassName} w-auto object-contain block transition-transform duration-200 hover:scale-105`}
      />
    </div>
  );
}

export default PassPassLogo;
