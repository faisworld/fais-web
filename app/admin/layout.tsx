"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import Link from "next/link";
import AllPages from "./pages/all-pages/page";
import CreatePage from "./pages/create-page/page";
import PageComponents from "./pages/page-components/page";
import Gallery from "./pages/gallery/gallery";
import Users from "./pages/users/page";
import Dashboard from "./dashboard/page";
import Settings from "./settings";

// Define the type for a menu item
interface MenuItemType {
    name: string;
    key: string;
    subMenu?: MenuItemType[]; // Optional property for submenus
}

const menuItems: MenuItemType[] = [
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
    { name: "Settings", key: "settings" },
];

function MenuItem({
    item,
    activeMenu,
    activeSubMenu,
    onMenuClick,
    onSubMenuClick,
}: {
    item: MenuItemType;
    activeMenu: string;
    activeSubMenu: string;
    onMenuClick: (key: string) => void;
    onSubMenuClick: (key: string) => void;
}) {
    return (
        <li key={item.key} className="mb-2">
            {item.subMenu ? (
                <div>
                    <button
                        onClick={() => onMenuClick(item.key)}
                        className={`flex items-center w-full p-3 text-sm font-medium rounded-lg transition-colors ${
                            activeMenu === item.key
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <span className="flex-1 text-left">{item.name}</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {activeMenu === item.key && (
                        <ul className="mt-1 pl-4 space-y-1">
                            {item.subMenu.map((subItem) => (
                                <li key={subItem.key}>
                                    <button
                                        className={`flex w-full items-center p-2 pl-4 text-sm rounded-md ${
                                            activeSubMenu === subItem.key
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                        onClick={() => onSubMenuClick(subItem.key)}
                                    >
                                        {subItem.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <button
                    className={`flex items-center w-full p-3 text-sm font-medium rounded-lg transition-colors ${
                        activeMenu === item.key
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => onMenuClick(item.key)}
                >
                    <span>{item.name}</span>
                </button>
            )}
        </li>
    );
}

export default function AdminLayout() {
    const router = useRouter(); // Use next/navigation's useRouter
    const [activeMenu, setActiveMenu] = useState<string>("dashboard");
    const [activeSubMenu, setActiveSubMenu] = useState<string>("");

    useEffect(() => {
        // Check URL query parameters for activeMenu and activeSubMenu
        const queryMenu = new URLSearchParams(window.location.search).get("activeMenu");
        const querySubMenu = new URLSearchParams(window.location.search).get("activeSubMenu");

        if (queryMenu) {
            setActiveMenu(queryMenu);
        }
        if (querySubMenu) {
            setActiveSubMenu(querySubMenu);
        }
    }, []);

    useEffect(() => {
        // Update the URL with the current activeMenu and activeSubMenu
        const params = new URLSearchParams();
        params.set("activeMenu", activeMenu);
        if (activeSubMenu) {
            params.set("activeSubMenu", activeSubMenu);
        }
        router.push(`?${params.toString()}`);
    }, [activeMenu, activeSubMenu]);

    const handleMenuClick = (key: string): void => {
        setActiveMenu(key);

        // Set default submenu for "Pages"
        if (key === "pages") {
            setActiveSubMenu("all-pages");
        } else {
            setActiveSubMenu(""); // Reset submenu for other menus
        }
    };

    const handleSubMenuClick = (key: string): void => {
        setActiveSubMenu(key);
        setActiveMenu("pages");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md h-screen fixed">
                <div className="p-4 text-xl font-bold text-gray-800 border-b border-gray-200">
                    <Link href="/admin" className="flex items-center">
                        <span className="text-blue-600 mr-2">FAIS</span> Admin Panel
                    </Link>
                </div>
                <nav className="mt-6">
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.key}
                                item={item}
                                activeMenu={activeMenu}
                                activeSubMenu={activeSubMenu}
                                onMenuClick={handleMenuClick}
                                onSubMenuClick={handleSubMenuClick}
                            />
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    {activeMenu === "dashboard" && <Dashboard />}
                    {activeMenu === "pages" && activeSubMenu === "all-pages" && <AllPages />}
                    {activeMenu === "pages" && activeSubMenu === "create-page" && <CreatePage />}
                    {activeMenu === "pages" && activeSubMenu === "page-components" && <PageComponents />}
                    {activeMenu === "gallery" && <Gallery />}
                    {activeMenu === "users" && <Users />}
                    {activeMenu === "settings" && <Settings />}
                    {/* Fallback message */}
                    {!activeMenu && <p className="text-gray-500">No content to display.</p>}
                </div>
            </main>
        </div>
    );
}
