import React from 'react';

const Topbar = ({ title, showNotification = true }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white border-b-[0.5px] border-gray-200 h-[52px] flex items-center justify-between px-6">
      {/* Left Section */}
      <div>
        <h1 className="text-[15px] font-medium text-gray-900">{title}</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">{today}</p>
      </div>

      {/* Right Section */}
      <div className="relative">
        {showNotification && (
          <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-[#E24B4A] rounded-full"></span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
