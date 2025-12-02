// src/app/page.tsx

import HeroSection from "@/components/archive/2nd/HeroSection";
import { StatementShort } from "@/components/archive/2nd/Statement";
import { SimpleButton } from "@/components/button";
import ContentList from "@/components/articles/ContentList";
import { OPEN_TALKS } from "lib/openTalks";
import { ProgramPhase1, ProgramPhase2, ProgramPhase3 } from "@/components/archive/2nd/ProgramPhase";
import { Header, Menu } from "@/components/layout";
import ProgramDetailSection from "@/components/archive/2nd/ProgramDetailSection";
import ApplicationSection from "@/components/archive/2nd/ApllicationSection";
import Tagline from "@/components/archive/2nd/Tagline";
import Image from "next/image";
import { getArticles, getNews } from "@/lib/api";


export default async function Page() {

  const articles = await getArticles();
  const news = await getNews();
  const openTalks = OPEN_TALKS.slice(2, 4); // 最新の2件を表示

  return (
    <div className="w-full pb-50">
      <Header />
      <Menu />

      <div className='pt-30 px-[8vw]'>
        <h1 className='font-en text-3xl md:text-5xl font-bold'>Archive</h1>
        <p className="text-fluid-lg mt-6">
          2025年7月より開催したプログラム第2期のアーカイブです
        </p>
      </div>







      <div className='w-full px-[14px] lg:px-[4vw]'>

        {/* Main Container */}
        <div className="w-full p-[14px] lg:p-[4vw] flex flex-col lg:flex-row gap-[8vw]">

          {/* Left Conteiner */}
          <div className="w-full lg:w-2/3">

            {/* Icon Section */}
            <section className="w-full section-spacing pb-4">
              <ProgramPhase1 />
            </section>
            <section className="w-full section-spacing pb-4 border-t border-border">
              <ProgramPhase2 />
            </section>
            <section className="w-full section-spacing pb-4 border-t border-border">
              <ProgramPhase3 />
            </section>

            {/* Peatix Section */}
            <section className="w-full section-spacing border-t border-border">
              <h2 className="font-en font-bold text-fluid-4xl leading-none relative px-[1.5vw] inline-block mb-8">
                <Image
                  src="/gifs/green-mosaic.gif"
                  alt="green mosaic"
                  width={500}
                  height={140}
                  className="absolute inset-0 w-full h-full scale-x-[1.1] object-cover -z-10"
                  quality={80}
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
                Creative-LAB. Open TALKs
              </h2>
              <div className="text-fluid-sm leading-normal pb-6 w-full">
                Creative-LAB. Open TALK は、自らの表現活動やクリエイティブワークを通して、既存の枠組みにとらわれず、
                自らの衝動から表現と生き方を切り拓いてきたゲストを招いた <b><u>全5回の対話型トークシリーズ</u></b> です。<br></br>
                彼らの語る経験や問いを通じて、「どうつくるか」だけでなく「どう生きるか」という視点から、
                ものづくりの現場で培われた知見、挑戦、そして越境の技法を共有します。デザインと生の関係性を捉え直し、
                これからの時代におけるクリエイターの新たなモデルを探る機会を探ります。
              </div>

              <div className="hidden md:block">
                <ContentList contents={openTalks} basePath="/open-talks" columns={2} gap={50} enableMosaic={false} />
              </div>
              <div className="block md:hidden">
                <ContentList contents={openTalks} basePath="/open-talks" columns={1} gap={50} enableMosaic={false} />
              </div>

              <div className="text-fluid-lg leading-normal pt-14 pl-6 w-full">
                ◾️第5回は随時公開予定です。開催日は以下の通りです。
                <ul className="mt-4 ml-4">
                  <li>#5 開催日：2025.11.14</li>
                </ul>
              </div>

            </section>

            {/* Program Section */}
            <section className="w-full section-spacing border-t border-border">
              <ProgramDetailSection />
            </section>

            {/* Application Section */}
            <div className="w-full section-spacing border-t border-border">
              <ApplicationSection />
            </div>



          </div>

          {/* Right Container */}
          <div className="w-full lg:w-1/3">
            {/* Statement Section*/}
            <section className="w-full pt-0 lg:pt-20 px-[2.5vw] section-spacing">
              <StatementShort />

              <div className="w-full mt-20 flex justify-start">
                <SimpleButton icon="right" href="/news/press-release">
                  About Creative Lab.
                </SimpleButton>
              </div>
            </section>

            {/* Articles Section */}
            <section className="w-full section-spacing border-t border-border">
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
                  <ContentList contents={articles} basePath="/articles" columns={1} gap={100} enableMosaic={true} programTerms={['2ND']} />
                </div>
                <div className="block lg:hidden w-full">
                  <ContentList contents={articles} basePath="/articles" columns={1} gap={100} enableMosaic={false} programTerms={['2ND']} />
                </div>
              </div>

            </section>




          </div>

        </div>





      </div>


    </div>
  );
}