"use client";

import { useState } from "react";
import { useRouter } from "next/compat/router"; // Use compat router
import Dashboard from "./dashboard";
import AllPages from "./pages/all-pages/page";
import CreatePage from "./pages/create-page/page";
import PageComponents from "./pages/page-components/page";
import Gallery from "./pages/gallery/gallery";
import Users from "./pages/users/page";

const menuItems = [
    { name: "Dashboard", key: "dashboard" },
    {
        name: "Pages",
        key: "pages",
        subMenu: [
            { name: "All Pages", key: "all-pages" },
            { name: "Create Page", key: "create-page" },
            { name: "Page Components", key: "page-components" },
        ],
    },
    { name: "Gallery", key: "gallery" },
    { name: "Users", key: "users" },
];

export default function AdminLayout() {
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [activeSubMenu, setActiveSubMenu] = useState("");
    const router = useRouter(); // Use compat router

    const renderContent = () => {
        switch (activeMenu) {
            case "dashboard":
                return <Dashboard />;
            case "all-pages":
                return <AllPages />;
            case "create-page":
                return <CreatePage />;
            case "page-components":
                return <PageComponents />;
            case "gallery":
                return <Gallery />;
            case "users":
                return <Users />;
            default:
                return <div className="text-gray-500">Page not found.</div>;
        }
    };

    interface MenuItem {
        name: string;
        key: string;
        subMenu?: SubMenuItem[];
    }

    interface SubMenuItem {
        name: string;
        key: string;
    }

    const handleMenuClick = (key: string): void => {
        if (activeMenu === key) {
            setActiveMenu(""); // Collapse the menu if it's already active
        } else {
            setActiveMenu(key);
            if (key === "pages") {
                setActiveSubMenu("all-pages");
                router?.push("/admin/pages/all-pages"); // Use optional chaining
            } else {
                router?.push(`/admin/${key}`); // Use optional chaining
            }
        }
    };

    interface HandleSubMenuClickParams {
        key: string;
    }

    const handleSubMenuClick = (key: HandleSubMenuClickParams["key"]): void => {
        setActiveSubMenu(key);
        setActiveMenu("pages"); // Ensure the main menu stays expanded
        router?.push(`/admin/pages/${key}`); // Use optional chaining
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-4 text-xl font-bold text-gray-800">Admin Panel</div>
                <nav className="mt-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                <button
                                    className={`w-full text-left px-4 py-2 ${activeMenu === item.key ? "bg-blue-500 text-white" : "text-gray-700"
                                        }`}
                                    onClick={() => handleMenuClick(item.key)}
                                >
                                    {item.name}
                                </button>
                                {item.subMenu && activeMenu === item.key && (
                                    <ul className="ml-4 mt-2 space-y-1">
                                        {item.subMenu.map((subItem) => (
                                            <li key={subItem.key}>
                                                <button
                                                    className={`w-full text-left px-4 py-2 ${activeSubMenu === subItem.key
                                                        ? "bg-blue-500 text-white"
                                                        : "text-gray-700"
                                                        }`}
                                                    onClick={() => handleSubMenuClick(subItem.key)}
                                                >
                                                    {subItem.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">{renderContent()}</main>
        </div>
    );
}