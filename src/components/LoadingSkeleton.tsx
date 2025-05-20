import React from 'react';

const LoadingSkeleton: React.FC = () => {
    return (
        <div
            className="w-full bg-muted/20 rounded-xl overflow-hidden animate-pulse  flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-40 h-48 sm:h-24 bg-zinc-800 rounded-lg"/>

            <div className="flex-1 flex flex-col justify-around space-y-3">
                <div className="h-4 bg-zinc-700 rounded w-3/4"/>
                <div className="h-4 bg-zinc-700 rounded w-1/2"/>
                <div className="h-3 bg-zinc-700 rounded w-1/3"/>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
