// app/news/page.tsx
import { redirect } from 'next/navigation'

export default function NewsPage() {
  // サーバーサイドリダイレクト
  redirect('/articles#news')
}