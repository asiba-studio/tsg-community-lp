
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Header, Menu } from 'components/layout';
import { ContentList } from 'components/articles';
import { getArticles, getNews } from 'lib/api';

export const metadata: Metadata = {
  title: '記事一覧',
  description: 'Creative-Lab. の記事一覧です',
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  const news = await getNews();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full pb-50">
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
          <h2 className="font-en font-bold text-fluid-5xl leading-none relative px-[1.5vw] inline-block mb-8">
            <Image
              src="/gifs/green-mosaic.gif"
              alt="green mosaic"
              width={500}
              height={140}
              className="absolute inset-0 w-full h-full scale-x-[1.1] object-cover -z-10"
              quality={80}
              sizes="(max-width: 768px) 50vw, 30vw"
            />
            Article
          </h2>

          <div className="w-full">
            <div className="hidden lg:block w-full">
              <ContentList
                contents={articles} basePath="/articles" columns={{ default: 1, md: 2, lg: 3 }} gap={"4vw"} description={true} enableMosaic={true}
              />
            </div>
            <div className="block lg:hidden w-full">
              <ContentList
                contents={articles} basePath="/articles" columns={{ default: 1, md: 2, lg: 3 }} gap={"4vw"} description={true} enableMosaic={false}
              />
            </div>
          </div>

        </section>

        <section id="news" className="w-full pt-30 section-spacing border-t border-border">
          <h2 className="font-en font-bold text-fluid-5xl leading-none relative px-[1.5vw] inline-block mb-8">
            <Image
              src="/gifs/green-mosaic.gif"
              alt="green mosaic"
              width={500}
              height={140}
              className="absolute inset-0 w-full h-full scale-x-[1.1] object-cover -z-10"
              quality={80}
              sizes="(max-width: 768px) 50vw, 30vw"
            />
            News
          </h2>

          <ContentList
            contents={news} basePath="/news" columns={{ default: 1, md: 2, lg: 3 }} gap={"4vw"} description={true} enableMosaic={false}
          />
        </section>


      </div>


    </div>
  );
}