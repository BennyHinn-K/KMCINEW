import React from 'react';
import { cn } from '@/lib/utils';

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
          className={cn(
            "shimmer-bg animate-shimmer rounded-xl shadow-1 border border-border p-lg w-full",
            className
          )}
        >
          <div className="h-48 bg-surface-elevated/80 rounded-lg mb-lg w-full"></div>
          <div className="h-6 bg-surface-elevated/80 rounded w-3/4 mb-md"></div>
          <div className="h-4 bg-surface-elevated/80 rounded w-1/2 mb-lg"></div>
          <div className="space-y-xs">
            <div className="h-3 bg-surface-elevated/80 rounded w-full"></div>
            <div className="h-3 bg-surface-elevated/80 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
