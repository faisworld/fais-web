"use client";

import React from "react";
import Link from "next/link";

interface Page {
    id: string;
    title: string;
    slug: string;
    metaTitle: string;
    description: string;
    isHomepage: boolean;
}

// Existing homepage data
const homepage: Page = {
    id: "1",
    title: "Homepage",
    slug: "/",
    metaTitle: "Welcome to Our Website",
    description: "This is the homepage of our website, showcasing the main content and features.",
    isHomepage: true,
};

export default function AllPages() {
    const handleClone = (page: Page) => {
        // Logic to clone the page
        console.log(`Cloning page: ${page.title}`);
        alert(`Page "${page.title}" cloned successfully!`);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All Pages</h1>
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Title</th>
                        <th className="border border-gray-300 p-2">Slug</th>
                        <th className="border border-gray-300 p-2">Meta Title</th>
                        <th className="border border-gray-300 p-2">Description</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {/* Page Title */}
                        <td className="border border-gray-300 p-2">{homepage.title}</td>

                        {/* Page Slug */}
                        <td className="border border-gray-300 p-2">{homepage.slug}</td>

                        {/* Meta Title */}
                        <td className="border border-gray-300 p-2">{homepage.metaTitle}</td>

                        {/* Description */}
                        <td className="border border-gray-300 p-2">
                            {homepage.description.length > 50
                                ? `${homepage.description.substring(0, 50)}...`
                                : homepage.description}
                        </td>

                        {/* Actions */}
                        <td className="border border-gray-300 p-2">
                            {/* View Button */}
                            <Link href={homepage.slug}>
                                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                                    View
                                </button>
                            </Link>

                            {/* Edit Button */}
                            <Link href={`/admin/pages/edit/${homepage.id}`}>
                                <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">
                                    Edit
                                </button>
                            </Link>

                            {/* Clone Button */}
                            <button
                                onClick={() => handleClone(homepage)}
                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                            >
                                Clone
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}