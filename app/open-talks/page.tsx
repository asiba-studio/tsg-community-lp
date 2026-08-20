import { OPEN_TALKS } from 'lib/openTalks';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Header } from 'components/layout';
import { ContentList } from 'components/articles';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Open TALKs一覧',
  description: 'Creative-LAB. Open TALKs一覧です',
  alternates: {
    canonical: '/open-talks',
  },
};

export default async function OpenTalksPage() {

  const openTalks = OPEN_TALKS;

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

      <div className='pt-30 px-[8vw]'>
        <h1 className='font-en text-3xl md:text-5xl font-bold'>Creative-LAB. Open TALKs</h1>
        <p className="text-lg mt-12 w-full md:w-2/3">
          Creative-LAB. Open TALK は、自らの表現活動やクリエイティブワークを通して、既存の枠組みにとらわれず、
          自らの衝動から表現と生き方を切り拓いてきたゲストを招いた
          <Image
            src="/gifs/green-mosaic.gif"
            unoptimized
            alt="green mosaic"
            width={500}
            height={140}
            className="inline w-28 -mr-28"
          /> 全5回の対話型トークシリーズ です。<br></br>
          彼らの語る経験や問いを通じて、「どうつくるか」だけでなく「どう生きるか」という視点から、
          ものづくりの現場で培われた知見、挑戦、そして越境の技法を共有します。デザインと生の関係性を捉え直し、
          これからの時代におけるクリエイターの新たなモデルを探る機会を探ります。
        </p>
      </div>

      <div className='w-full px-[14px] lg:px-[4vw]'>
        <section className="w-full  pt-30">

          <div className="w-full">
            <div className="hidden lg:block w-full">
              <ContentList
                contents={openTalks} basePath="/open-talks" columns={{ default: 1, md: 2, lg: 3 }} gap={"4vw"} description={true} enableMosaic={false}
              />
            </div>
            <div className="block lg:hidden w-full">
              <ContentList
                contents={openTalks} basePath="/open-talks" columns={{ default: 1, md: 2, lg: 3 }} gap={"4vw"} description={true} enableMosaic={false}
              />
            </div>
          </div>

        </section>

      </div>

    </div>
  );
}