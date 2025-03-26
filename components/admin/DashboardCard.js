import React from 'react';

export default function DashboardCard({ title, icon, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-150 p-6">
      {title && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-2">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}
