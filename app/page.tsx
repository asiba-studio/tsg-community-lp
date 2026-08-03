// src/app/page.tsx

import { StatementShort } from "../components/home/Statement";
import { SimpleButton } from "components/button";
import ContentList from "components/articles/ContentList";
import { ProgramPhase1, ProgramPhase2, ProgramPhase3 } from "../components/home/ProgramPhase";
import { Header, Menu } from "components/layout";
import ProgramDetailSection from "../components/home/ProgramDetailSection";
import ApplicationSection from "../components/home/ApllicationSection";
//import PlayerSection from "./components/PlayerSection";
import Tagline from "../components/home/Tagline";
import Image from "next/image";
import { getArticles, getNews } from "lib/api";


export default async function Page() {

  const articles = await getArticles();
  const news = await getNews();
  const newsSlice = news.slice(0, 2);

  return (
    <div>

      {/* Hero Section: 4期のキービジュアル未定のためプレースホルダー */}
      <section className="w-full aspect-[16/9] md:aspect-[1300/680] border border-border bg-white" />

      {/* Navigation */}
      <div className="h-1 md:border-t md:border-border" />
      <Header />

      <Menu className="lg:hidden mt-20 mb-40" />


      {/* Tagline */}
      <section className="w-full h-auto mt-40 mb-70 p-[4vw]">
        <Tagline />
      </section>

      {/* Main Container */}
      <div className="w-full p-[14px] lg:p-[4vw] -mt-40 flex flex-col lg:flex-row gap-[8vw]">

        {/* Left Conteiner */}
        <div className="w-full lg:w-2/3">

          {/* News Section */}
          <section className="w-full pt-[100px] border-t border-border">
            <h2 className="font-en font-bold text-fluid-5xl leading-none relative px-[1.5vw] inline-block mb-8">
              <Image
                src="/gifs/green-mosaic.gif"
                unoptimized
                alt="green mosaic"
                width={500}
                height={140}
                className="absolute inset-0 w-full h-full scale-x-[1.1] object-cover -z-10"
                quality={80}
                sizes="(max-width: 768px) 50vw, 30vw"
              />
              News
            </h2>



            <div className="hidden md:block">
              <ContentList contents={newsSlice} basePath="/news" columns={2} gap={100} enableMosaic={false} />
            </div>
            <div className="block md:hidden">
              <ContentList contents={newsSlice} basePath="/news" columns={1} gap={100} enableMosaic={false} />
            </div>



          </section>

          {/* Icon Section */}
          <section id="program" className="w-full section-spacing pb-4 border-t border-border">
            <ProgramPhase1 />
          </section>
          <section className="w-full section-spacing pb-4 border-t border-border">
            <ProgramPhase2 />
          </section>
          <section className="w-full section-spacing pb-4 border-t border-border">
            <ProgramPhase3 />
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
          <section className="w-full pt-0 lg:pt-100 px-[2.5vw] section-spacing">
            <StatementShort />

            <div className="w-full mt-20 flex justify-start">
              <SimpleButton icon="right" href="/about">
                About Community Design-LAB.
              </SimpleButton>
            </div>
          </section>

          {/* Articles Section */}
          <section className="w-full section-spacing border-t border-border">
            <h2 className="font-en font-bold text-fluid-5xl leading-none relative px-[1.5vw] inline-block mb-8">
              <Image
                src="/gifs/green-mosaic.gif"
                unoptimized
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
                <ContentList contents={articles} basePath="/articles" columns={1} gap={100} enableMosaic={true} />
              </div>
              <div className="block lg:hidden w-full">
                <ContentList contents={articles} basePath="/articles" columns={1} gap={100} enableMosaic={false} />
              </div>
            </div>

          </section>




        </div>

      </div>

    </div>
  );
}
