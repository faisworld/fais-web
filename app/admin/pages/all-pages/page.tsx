"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


export default function AllPages() {
    const [pages, setPages] = useState<PageData[]>([]);
    useEffect(() => {
        async function fetchPages() {
            const response = await fetch("/admin/pagesData.json");
            const data = await response.json();
            setPages(data);
        }
        fetchPages();
    }, []);



interface PageData {
    title: string;
    slug: string;
    description?: string;
}



    useEffect(() => {
        // Fetch pages data from the JSON file
        async function fetchPages() {
            try {
                const response = await fetch("/admin/pagesData.json");
                const data = await response.json();
                setPages(data);
            } catch (error) {
                console.error("Error fetching pages data:", error);
            }
        }

        fetchPages();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">All Pages</h1>
                {pages.length === 0 ? (
                    <p className="text-gray-700">No pages found. Create a new page to get started.</p>
                ) : (
                    <ul className="space-y-4">
                        {pages.map((page) => (
                            <li
                                key={page.slug}
                                className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">{page.title}</h2>
                                    <p className="text-sm text-gray-600">{page.description || "No description available"}</p>
                                </div>
                                <div className="space-x-2">
                                    <Link href={`/admin/pages/edit/${page.slug}`}>
                                        <a className="text-blue-500 hover:underline">Edit</a>
                                    </Link>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleDelete(page.slug)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

    function handleDelete(slug: string) {
        if (confirm("Are you sure you want to delete this page?")) {
            setPages((prevPages) => prevPages.filter((page) => page.slug !== slug));
            // Add logic to update the JSON file or backend here
        }
    }
}