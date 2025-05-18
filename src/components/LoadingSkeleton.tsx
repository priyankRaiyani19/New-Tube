import React from 'react';

const LoadingSkeleton: React.FC = () => {
    return (
        <div className="bg-card rounded-lg overflow-hidden animate-pulse">


            <div className="flex gap-4">
                <div className="min-w-44 h-24 bg-gray-800 rounded"/>

                <div className="flex flex-col justify-around w-full">
                    <div className="h-4 bg-gray-800 rounded w-3/4"/>
                    <div className="h-4 bg-gray-800 rounded w-1/2"/>
                    <div className="h-3 bg-gray-800 rounded w-1/3"/>
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
