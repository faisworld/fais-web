"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPage({ params }: { params: { slug: string } }) {
    const [pageData, setPageData] = useState({
        title: "",
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchPageData() {
            try {
                const response = await fetch(`/api/pages/${params.slug}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch page data");
                }
                const data = await response.json();
                setPageData(data);
            } catch (error) {
                console.error("Error fetching page data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPageData();
    }, [params.slug]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPageData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/pages/${params.slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pageData),
            });
            if (response.ok) {
                alert("Page updated successfully!");
                router.push("/admin/pages/all-pages");
            } else {
                alert("Failed to update page.");
            }
        } catch (error) {
            console.error("Error updating page:", error);
        }
    };

    if (loading) {
        return <p>Loading page data...</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit Page</h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={pageData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={pageData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
