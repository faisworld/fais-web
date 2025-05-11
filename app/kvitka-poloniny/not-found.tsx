// app/kvitka-poloniny/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Сторінку не знайдено</h1>
      <p className="mb-6">Вибачте, запитана сторінка не існує.</p>
      <Link 
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Повернутися на головну
      </Link>
    </div>
  )
}
