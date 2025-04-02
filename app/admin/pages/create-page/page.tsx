"use client";

import { useState } from "react";

const availableComponents = [
    { name: "HeroSection", label: "Hero Section", configFields: ["title", "subtitle", "description"] },
    { name: "SolutionsSection", label: "Solutions Section", configFields: ["heading", "content"] },
    { name: "QuoteSection", label: "Quote Section", configFields: ["quote", "author"] },
];

export default function CreatePage() {
    const [pageTitle, setPageTitle] = useState("");
    const [pageSlug, setPageSlug] = useState("");
    const [pageDescription, setPageDescription] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [components, setComponents] = useState<Component[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const validateFields = () => {
        if (!pageTitle.trim()) return "Page title is required.";
        if (!pageSlug.trim()) return "Page slug is required.";
        if (!pageDescription.trim()) return "Page description is required.";
        if (!metaTitle.trim()) return "Meta title is required.";
        if (!metaDescription.trim()) return "Meta description is required.";
        if (components.length === 0) return "At least one component must be added.";
        return null;
    };

    const handleCreatePage = async () => {
        const validationError = validateFields();
        if (validationError) {
            setMessage(validationError);
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/save-page", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: pageTitle,
                    slug: pageSlug,
                    description: pageDescription,
                    metaTitle,
                    metaDescription,
                    components,
                }),
            });

            if (response.ok) {
                setMessage("Page saved successfully!");
                setPageTitle("");
                setPageSlug("");
                setPageDescription("");
                setMetaTitle("");
                setMetaDescription("");
                setComponents([]);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to save page: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Error saving page:", error);
            setMessage("An error occurred while saving the page.");
        } finally {
            setIsLoading(false);
        }
    };

    interface ComponentConfig {
        [key: string]: string;
    }

    interface Component {
        name: string;
        config: ComponentConfig;
    }

    const handleAddComponent = (componentName: string): void => {
        const componentConfigFields: string[] =
            availableComponents.find((comp) => comp.name === componentName)?.configFields || [];
        const initialConfig: ComponentConfig = componentConfigFields.reduce((obj, field) => {
            obj[field] = "";
            return obj;
        }, {} as ComponentConfig);
        setComponents((prevComponents: Component[]) => [...prevComponents, { name: componentName, config: initialConfig }]);
    };

    const handleConfigChange = (index: number, field: string, value: string): void => {
        setComponents((prevComponents: Component[]) =>
            prevComponents.map((component: Component, i: number) =>
                i === index ? { ...component, config: { ...component.config, [field]: value } } : component
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Page</h1>

                {/* Page Title Input */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Page Title</label>
                    <input
                        type="text"
                        placeholder="Enter page title"
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Page Slug Input */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Page Slug</label>
                    <input
                        type="text"
                        placeholder="Enter page slug"
                        value={pageSlug}
                        onChange={(e) => setPageSlug(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Page Description Input */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Page Description</label>
                    <textarea
                        placeholder="Enter page description"
                        value={pageDescription}
                        onChange={(e) => setPageDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Meta Title Input */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Meta Title</label>
                    <input
                        type="text"
                        placeholder="Enter meta title for SEO"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Meta Description Input */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Meta Description</label>
                    <textarea
                        placeholder="Enter meta description for SEO"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Available Components */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Components</h2>
                    <div className="flex gap-4">
                        {availableComponents.map((component) => (
                            <button
                                key={component.name}
                                onClick={() => handleAddComponent(component.name)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                {component.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Components */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Selected Components</h2>
                    {components.length === 0 ? (
                        <p className="text-gray-500">No components selected yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {components.map((component, index) => (
                                <li key={index} className="border border-gray-300 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-800">{component.name}</h3>
                                    <div className="mt-4 space-y-2">
                                        {Object.keys(component.config).map((field) => (
                                            <div key={field}>
                                                <label className="block text-gray-700 font-medium">{field}</label>
                                                <input
                                                    type="text"
                                                    value={component.config[field] || ""}
                                                    onChange={(e) => handleConfigChange(index, field, e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Feedback Message */}
                {message && <p className="text-red-500 mb-4">{message}</p>}

                {/* Create Page Button */}
                <button
                    onClick={handleCreatePage}
                    className={`w-full px-4 py-2 rounded-lg ${isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                    disabled={isLoading}
                >
                    {isLoading ? "Saving..." : "Create Page"}
                </button>

                {/* Preview Button */}
                <button
                    onClick={() => {
                        const previewUrl = `/preview/${pageSlug}`;
                        window.open(previewUrl, "_blank");
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Preview
                </button>
            </div>
        </div>
    );
}