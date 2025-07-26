import { getArticles, getFeaturedArticles, getNews } from '@/lib/cms';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Header, Menu } from '@/components/layout';
import { ContentList } from '@/components/articles';

export const metadata: Metadata = {
  title: '記事一覧',
  description: '最新の記事をご覧ください',
};

export default async function ArticlesPage() {
  const [articles, featuredArticles] = await Promise.all([
    getArticles(),
    getFeaturedArticles()
  ]);

  const news = await getNews();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <Header />
      <Menu />

      <div className='pt-30 px-[8vw]'>
        <h1 className='font-en text-3xl md:text-5xl font-bold'>Article and News</h1>
        <p className="text-fluid-lg mt-6">
          TSG Creative Lab. に関する記事や最新情報をお届けします。
        </p>
      </div>







      <div className='w-full px-[14px] lg:px-[4vw]'>
      <section className="w-full  pt-30">
        <h2 className='ml-6 mb-10'>
          <img
            src="/gifs/article.gif"
            className='h-10 lg:h-16'
          />
          <span className="sr-only">記事一覧</span>
        </h2>

        <ContentList
          contents={articles} basePath="/articles" columns={3} gap={100} description={true}
        />
      </section>

      <section id="news" className="w-full pt-30 section-spacing border-t border-border">
        <h2 className='ml-6 mb-10'>
          <img
            src="/gifs/news.gif"
            className='h-10 lg:h-16'
          />
          <span className="sr-only">記事一覧</span>
        </h2>

        <ContentList
          contents={news} basePath="/news" columns={3} gap={100} description={true}
        />
      </section>


      </div>
      

    </div>
  );
}