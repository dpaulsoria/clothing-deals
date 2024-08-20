export default function SkeletonWS() {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform transition-transform duration-300 flex flex-col justify-between animate-pulse">
            <div className="p-6 flex-grow">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-5/6"></div>
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
            <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-t border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="flex space-x-3">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
};
