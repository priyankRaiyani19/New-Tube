import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-800" />
      <div className="p-3">
        <div className="h-4 bg-gray-800 rounded mb-2 w-5/6" />
        <div className="h-4 bg-gray-800 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;