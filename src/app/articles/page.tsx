// src/app/articles/page.tsx
import { Metadata } from 'next';
import { getArticles, getAllTags } from '@/lib/cms';
import ArticleCard from '@/components/articles/ArticleCard';
import TagFilter from '@/components/articles/TagFilter';

export const metadata: Metadata = {
  title: 'Articles | TSG Community',
  description: 'TSGコミュニティの記事一覧です。技術記事やプロジェクト情報をご覧いただけます。',
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  const allTags = await getAllTags();
  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              記事一覧
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TSGコミュニティの技術記事やプロジェクト情報をお読みいただけます
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* タグフィルター */}
        <TagFilter tags={allTags} />

        {/* 注目記事セクション */}
        {featuredArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">注目記事</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  featured
                />
              ))}
            </div>
          </section>
        )}

        {/* 記事一覧セクション */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {featuredArticles.length > 0 ? 'すべての記事' : `全 ${articles.length} 件の記事`}
          </h2>
          
          {regularArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">記事がありません</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}