export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
    return (
        <nav className="breadcrumbs text-sm text-gray-600">
            <ol className="list-reset flex">
                {items.map((item, index) => (
                    <li key={index}>
                        {item.href ? (
                            <a href={item.href} className="text-blue-600 hover:underline">
                                {item.label}
                            </a>
                        ) : (
                            <span className="text-gray-500">{item.label}</span>
                        )}
                        {index < items.length - 1 && <span className="mx-2">/</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
