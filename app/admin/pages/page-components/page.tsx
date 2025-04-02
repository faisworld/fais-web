
"use client";

import { useState } from "react";

export default function PageComponents() {
    interface ComponentConfig {
        title?: string;
        subtitle?: string;
        description?: string;
        quote?: string;
        author?: string;
        [key: string]: string | undefined;
    }

    interface Component {
        name: string;
        config: ComponentConfig;
    }

    interface Page {
        page: string;
        components: Component[];
    }

    const [pageComponents, setPageComponents] = useState<Page[]>([
        {
            page: "Home Page",
            components: [
                {
                    name: "HeroSection",
                    config: {
                        title: "Welcome",
                        subtitle: "To Our Website",
                        description: "Explore our services.",
                    },
                },
                {
                    name: "QuoteSection",
                    config: {
                        quote: "Innovation distinguishes between a leader and a follower.",
                        author: "Steve Jobs",
                    },
                },
            ],
        },
    ]);

    const [editingComponent, setEditingComponent] = useState<EditingComponent | null>(null);
    const [editingConfig, setEditingConfig] = useState<ComponentConfig>({});

    interface EditingComponent {
        pageIndex: number;
        componentIndex: number;
    }

    const handleEditClick = (pageIndex: number, componentIndex: number): void => {
        setEditingComponent({ pageIndex, componentIndex } as EditingComponent);
        setEditingConfig({ ...pageComponents[pageIndex].components[componentIndex].config });
    };

    interface HandleConfigChange {
        (field: string, value: string): void;
    }

    const handleConfigChange: HandleConfigChange = (field, value) => {
        setEditingConfig((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!editingComponent) return;
        const { pageIndex, componentIndex } = editingComponent;
        setPageComponents((prev) =>
            prev.map((page, pIndex) =>
                pIndex === pageIndex
                    ? {
                        ...page,
                        components: page.components.map((component, cIndex) =>
                            cIndex === componentIndex ? { ...component, config: editingConfig } : component
                        ),
                    }
                    : page
            )
        );
        setEditingComponent(null);
    };

    const handleCancel = () => {
        setEditingComponent(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Page Components</h1>
                <p className="text-gray-700 mb-4">
                    Below is a list of the components for each page. You can edit their configurations.
                </p>

                {pageComponents.length === 0 ? (
                    <p className="text-gray-500">No components have been added yet.</p>
                ) : (
                    <div className="space-y-6">
                        {pageComponents.map((page, pageIndex) => (
                            <div key={pageIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                <h2 className="text-xl font-semibold text-gray-800">{page.page}</h2>
                                <div className="mt-4 space-y-4">
                                    {page.components.map((component, componentIndex) => (
                                        <div
                                            key={componentIndex}
                                            className="border border-gray-300 rounded-lg p-4 bg-white"
                                        >
                                            {editingComponent &&
                                                editingComponent.pageIndex === pageIndex &&
                                                editingComponent.componentIndex === componentIndex ? (
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-800">
                                                        Editing: {component.name}
                                                    </h3>
                                                    <div className="mt-4 space-y-2">
                                                        {Object.keys(editingConfig).map((field) => (
                                                            <div key={field}>
                                                                <label className="block text-gray-700 font-medium">
                                                                    {field}
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={editingConfig[field] || ""}
                                                                    onChange={(e) =>
                                                                        handleConfigChange(field, e.target.value)
                                                                    }
                                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex space-x-4 mt-4">
                                                        <button
                                                            onClick={handleSave}
                                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-800">
                                                        {component.name}
                                                    </h3>
                                                    <div className="mt-2 space-y-1">
                                                        {Object.entries(component.config).map(([key, value]) => (
                                                            <p
                                                                key={key}
                                                                className="text-sm text-gray-600"
                                                            >
                                                                <strong>{key}:</strong> {value}
                                                            </p>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(pageIndex, componentIndex)
                                                        }
                                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                                    >
                                                        Edit Component
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}