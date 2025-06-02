import Link from "next/link"

export default function Breadcrumbs({
  items,
  darkBg = false,
}: {
  items: { label: string; href: string }[]
  darkBg?: boolean
}) {
  if (!items || items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex space-x-2 text-sm ${darkBg ? "text-white" : "text-gray-700"}`}>
        {items.map((item, idx) => (
          <li key={`${item.href}-${idx}`} className="flex items-center">
            {idx > 0 && <span className={darkBg ? "mx-1 text-gray-300" : "mx-1 text-gray-400"}>/</span>}
            {idx < items.length - 1 ? (
              <Link
                href={item.href}
                className={darkBg ? "hover:underline text-white" : "hover:underline text-gray-800"}
              >
                {item.label}
              </Link>
            ) : (
              <span className={darkBg ? "font-semibold text-white" : "font-semibold text-gray-700"}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
