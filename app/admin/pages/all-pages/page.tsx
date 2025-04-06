"use client";

import React from "react";
import Link from "next/link";

export default function AllPages() {
    const pages = [
        { title: "Homepage", slug: "homepage", description: "Main page" },
        { title: "About Us", slug: "about-us", description: "About our company" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All Pages</h1>
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Title</th>
                        <th className="border border-gray-300 p-2">Slug</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pages.map((page) => (
                        <tr key={page.slug}>
                            <td className="border border-gray-300 p-2">{page.title}</td>
                            <td className="border border-gray-300 p-2">{page.slug}</td>
                            <td className="border border-gray-300 p-2">
                                <Link href={`/admin/pages/edit/${page.slug}`}>
                                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                                        Edit
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}