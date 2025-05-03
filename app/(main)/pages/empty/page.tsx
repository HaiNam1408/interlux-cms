import React from 'react';

const EmptyPage = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">This Page is Under Development</h2>
                <p className="text-gray-600">We are currently working hard to bring this feature to life. Please check back soon!</p>
            </div>
        </div>
    );
};

export default EmptyPage;
