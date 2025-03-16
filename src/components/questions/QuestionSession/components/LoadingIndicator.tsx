
import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-lg">Loading questions...</p>
    </div>
  );
};

export default LoadingIndicator;
