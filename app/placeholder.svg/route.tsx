import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const width = Number.parseInt(searchParams.get("width") || "400", 10)
  const height = Number.parseInt(searchParams.get("height") || "300", 10)
  const query = searchParams.get("query") || "Image"

  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2a2a2a"/>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3a3a3a" strokeWidth="1"/>
        </pattern>
      </defs>
      <text x="50%" y="50%" fontFamily="Arial, sans-serif" fontSize="20" textAnchor="middle" dominantBaseline="middle" fill="#ffffff">
        ${query}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
