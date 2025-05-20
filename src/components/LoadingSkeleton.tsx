const LoadingSkeleton: React.FC = () => {
    return (
        <div
            className="w-full bg-zinc-950 rounded-xl overflow-hidden animate-pulse flex flex-col sm:flex-row gap-4 p-4">
            <div className="w-full sm:w-40 h-48 sm:h-24 bg-zinc-800 rounded-lg"/>
            <div className="flex flex-col justify-center gap-3 w-full">
                <div className="h-4 bg-zinc-700 rounded w-5/6 md:w-full"/>
                <div className="h-4 bg-zinc-700 rounded w-2/3"/>
                <div className="h-3 bg-zinc-700 rounded w-1/2"/>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
