"use client";

import { useState, useEffect } from "react";
import VapiWidget from "../VapiWidget";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalPages: 0,
        totalUsers: 0,
        totalMedia: 0,
        recentActivity: []
    });

    useEffect(() => {
        // Simulate fetching dashboard data
        const data = {
            totalPages: 24,
            totalUsers: 156,
            totalMedia: 438,
            recentActivity: [
                { id: 1, action: "Page created", user: "Admin", date: "Today, 10:30 AM" },
                { id: 2, action: "User registered", user: "John Doe", date: "Yesterday, 3:45 PM" },
                { id: 3, action: "Media uploaded", user: "Jane Smith", date: "Oct 15, 2:20 PM" }
            ]
        };
        setStats(data);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            {stats.totalPages === 0 ? (
                <p className="text-gray-500">Loading dashboard data...</p>
            ) : (
                <div>
                    <VapiWidget />
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-gray-500 text-sm uppercase font-semibold mb-2">Total Pages</h2>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalPages}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-gray-500 text-sm uppercase font-semibold mb-2">Total Users</h2>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-gray-500 text-sm uppercase font-semibold mb-2">Total Media</h2>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalMedia}</p>
                        </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {stats.recentActivity.map((activity: any) => (
                                <div key={activity.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <div>
                                        <p className="font-medium">{activity.action}</p>
                                        <p className="text-sm text-gray-500">by {activity.user}</p>
                                    </div>
                                    <span className="text-sm text-gray-400">{activity.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}