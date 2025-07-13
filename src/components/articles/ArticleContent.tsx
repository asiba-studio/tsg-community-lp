// src/components/ArticleContent.tsx
interface Props {
    content: string;
    excerpt: string;
  }
  
  export default function ArticleContent({ content, excerpt }: Props) {
    return (
      <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        {/* 記事の要約 */}
        <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <p className="text-blue-800 font-medium">{excerpt}</p>
        </div>
  
        {/* 記事本文 */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
            prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-5 prose-h3:mb-2
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:mb-1
            prose-img:rounded-lg prose-img:shadow-md
            prose-table:w-full prose-table:border-collapse
            prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3 prose-th:text-left prose-th:font-semibold
            prose-td:border prose-td:border-gray-300 prose-td:p-3"
          dangerouslySetInnerHTML={{ __html: content }}
        />
  
        {/* シェアボタン */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">この記事をシェア</p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Twitter
              </button>
              <button className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors">
                Facebook
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                リンクをコピー
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }