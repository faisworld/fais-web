"use client";

import { useState } from "react";
import HomePage from "../../../../components/pages/HomePage"; // Corrected import path

const components = [
    { name: "Home Page", component: <HomePage /> },
    { name: "About Page", component: <p className="text-gray-500">About Page component is not available yet.</p> },
    { name: "Contact Page", component: <p className="text-gray-500">Contact Page component is not available yet.</p> },
];

export default function PageComponents() {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Page Components</h1>
            <div className="flex space-x-4">
                <ul className="w-1/4 space-y-2">
                    {components.map((item) => (
                        <li key={item.name}>
                            <button
                                className={`w-full p-2 text-left rounded-md ${
                                    activeComponent === item.name
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() => setActiveComponent(item.name)}
                            >
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="w-3/4 p-4 bg-gray-50 rounded-lg shadow-md">
                    {activeComponent ? (
                        components.find((item) => item.name === activeComponent)?.component
                    ) : (
                        <p className="text-gray-500">Select a component to preview.</p>
                    )}
                </div>
            </div>
        </div>
    );
}