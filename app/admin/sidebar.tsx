"use client";

import Link from "next/link";

const menuItems = [
    { name: "Dashboard", path: "/admin" },
    {
        name: "Pages",
        subMenu: [
            { name: "All Pages", path: "/admin/pages/all-pages" },
            { name: "Create Page", path: "/admin/pages/create-page" },
            { name: "Page Components", path: "/admin/pages/page-components" },
        ],
    },
    { name: "Gallery", path: "/admin/gallery" },
    { name: "Users", path: "/admin/users" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4 text-xl font-bold text-gray-800">Admin Panel</div>
            <nav className="mt-4">
                <ul className="space-y-2">
                    {menuItems.map((item) =>
                        item.subMenu ? (
                            <li key={item.name}>
                                <div className="font-semibold px-4 py-2">{item.name}</div>
                                <ul className="ml-4 space-y-1">
                                    {item.subMenu.map((subItem) => (
                                        <li key={subItem.name}>
                                            <Link href={subItem.path}>
                                                <a className="block px-4 py-2 hover:bg-gray-200 rounded">
                                                    {subItem.name}
                                                </a>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ) : (
                            <li key={item.name}>
                                <Link href={item.path}>
                                    <a className="block px-4 py-2 hover:bg-gray-200 rounded">{item.name}</a>
                                </Link>
                            </li>
                        )
                    )}
                </ul>
            </nav>
        </aside>
    );
}