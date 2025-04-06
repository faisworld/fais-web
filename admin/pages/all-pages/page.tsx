import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the page type
interface Page {
    id: string;
    name: string;
    // ...other properties if needed...
}

export default function AllPages() {
    const router = useRouter();
    // Set the state type to Page[]
    const [pages, setPages] = useState<Page[]>([]); // ...existing code...

    const handleEdit = (pageId: string) => {
        // Navigate to page editor for the given pageId
        router.push(`/admin/edit-page?id=${pageId}`);
    };

    const handleClone = (pageId: string) => {
        // Clone the correct page using the defined type
        const pageToClone = pages.find(p => p.id === pageId);
        if (pageToClone) {
            const newPage: Page = { 
                ...pageToClone, 
                id: Date.now().toString(), 
                name: `${pageToClone.name} (Copy)` 
            };
            setPages(prev => [...prev, newPage]);
            alert(`Page "${pageToClone.name}" was cloned successfully`);
        }
    };

    return (
        <>
            {/* Upper right Create Page button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                <button onClick={() => router.push("/admin/create-page")}>
                    Create Page
                </button>
            </div>
            <div>
                {/* ...existing code rendering header and list */}
                {pages.map((page: Page) => (
                    <div key={page.id}>
                        <h3>{page.name}</h3>
                        <button onClick={() => handleEdit(page.id)}>Edit</button>
                        <button onClick={() => handleClone(page.id)}>Clone</button>
                        {/* ...other page details... */}
                    </div>
                ))}
            </div>
        </>
    );
}
