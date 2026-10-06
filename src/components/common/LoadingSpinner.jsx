import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-[#8b85ff] border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-[#9490b8] font-medium">{text}</p>}
    </div>
  );
}
