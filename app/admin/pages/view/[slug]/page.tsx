"use client";

import { useState, useEffect } from "react";

export default function ViewPage({ params }: { params: { slug: string } }) {
    const [pageData, setPageData] = useState({
        title: "",
        subtitle: "",
        metaTitle: "",
        description: "",
        previewImage: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPageData() {
            try {
                const response = await fetch(`/api/pages/${params.slug}`);
                const data = await response.json();
                setPageData(data);
            } catch (error) {
                console.error("Failed to fetch page data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPageData();
    }, [params.slug]);

    if (loading) {
        return <p>Loading page data...</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">{pageData.title}</h1>
            <p className="text-gray-500">{pageData.subtitle}</p>
            <img
                src={pageData.previewImage || "/placeholder.png"}
                alt={`${pageData.title} Preview`}
                className="w-full h-64 object-cover rounded-md my-4"
            />
            <p className="text-gray-700">{pageData.description}</p>
        </div>
    );
}
