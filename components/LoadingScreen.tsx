
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="h-full w-full bg-slate-950 p-6 lg:p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-800/50 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-slate-800 rounded-lg"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="h-64 bg-slate-900 border border-slate-800 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-20 bg-slate-900 border border-slate-800 rounded-xl"></div>
            <div className="h-20 bg-slate-900 border border-slate-800 rounded-xl"></div>
            <div className="h-20 bg-slate-900 border border-slate-800 rounded-xl"></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-40 bg-slate-900 border border-slate-800 rounded-xl"></div>
          <div className="h-96 bg-slate-900 border border-slate-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
