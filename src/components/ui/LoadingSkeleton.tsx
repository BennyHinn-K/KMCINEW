import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 1, className }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={`bg-slate-900 rounded-xl shadow-2xl p-4 w-full animate-pulse ${className}`}
        >
          <div className="h-48 bg-slate-800 rounded-lg mb-4 w-full"></div>
          <div className="h-6 bg-slate-800 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-800 rounded w-full"></div>
            <div className="h-3 bg-slate-800 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
