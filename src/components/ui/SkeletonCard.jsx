import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="flex flex-col h-full bg-base-100 rounded-2xl shadow-sm border border-base-200 p-0 overflow-hidden animate-pulse">
            {/* Image Placeholder */}
            <div className="h-48 bg-base-300 w-full"></div>
            
            {/* Content Placeholder */}
            <div className="p-6 flex flex-col flex-grow gap-4">
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                    <div className="h-6 bg-base-300 rounded w-2/3"></div>
                    <div className="h-6 bg-base-300 rounded-full w-16"></div>
                </div>
                
                {/* Description */}
                <div className="space-y-2 mt-2">
                    <div className="h-4 bg-base-300 rounded w-full"></div>
                    <div className="h-4 bg-base-300 rounded w-4/5"></div>
                </div>
                
                {/* Meta info */}
                <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                        <div className="h-4 bg-base-300 rounded w-24"></div>
                        <div className="h-4 bg-base-300 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between">
                        <div className="h-4 bg-base-300 rounded w-24"></div>
                        <div className="h-4 bg-base-300 rounded w-16"></div>
                    </div>
                </div>
                
                {/* Button Placeholder */}
                <div className="mt-auto pt-4">
                    <div className="h-10 bg-base-300 rounded-full w-full"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
