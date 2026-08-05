// src/app/page.tsx

import { StatementShort } from "../components/home/Statement";
import { SimpleButton } from "components/button";
import ArticleCard from "../components/home/ArticleCard";
import NewsCard from "../components/home/NewsCard";
import { ProgramPhase1, ProgramPhase2, ProgramPhase3 } from "../components/home/ProgramPhase";
import { Header } from "components/layout";
import ProgramDetailSection from "../components/home/ProgramDetailSection";
import ApplicationSection from "../components/home/ApllicationSection";
//import PlayerSection from "./components/PlayerSection";
import Tagline from "../components/home/Tagline";
import HalftoneHoverImage from "components/HalftoneHoverImage";
import { getArticles, getNews } from "lib/api";

export default async function Page() {

  const articles = await getArticles();
  const communityLabArticles = articles.filter((a) => a.programTerms?.includes('COMMUNITY-LAB'));
  const news = await getNews();
  const communityLabNews = news.filter((n) => n.programTerms?.includes('COMMUNITY-LAB'));
  const newsSlice = communityLabNews.slice(0, 2);

  return (
    <div>

      {/* Hero Section */}
      <section className="w-full border border-border bg-white overflow-hidden">
        <video
          src="/videos/animation-mobile.mp4"
          autoPlay
          muted
          playsInline
          className="w-full aspect-1080/1920 object-cover md:hidden"
        />
        <video
          src="/videos/animation-pc.mp4"
          autoPlay
          muted
          playsInline
          className="hidden md:block w-full aspect-1300/680 object-cover"
        />
      </section>

      {/* Navigation */}
      <div className="h-1 md:border-t md:border-border" />
      <Header />

      {/* Tagline */}
      <section className="w-full h-auto md:mt-20 p-[4vw]">
        <Tagline />
      </section>

      {/* Main Container */}
      <div className="w-full md:pb-80 px-3 md:px-8 grid grid-cols-1 md:grid-cols-[5fr_2fr] md:gap-x-[clamp(3rem,14vw,14rem)]">

        {/* Left Conteiner */}
        <div className="w-full">

          {/* News Section */}
          {newsSlice.length > 0 && (
            <section className="w-full pt-[100px]">
              <h2 className="font-en inline-block mb-8 text-primary">
                News
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-[clamp(3rem,7vw,7rem)]">
                {newsSlice.map((item) => (
                  <NewsCard key={item.id} news={item} showImageOnMobile={false} />
                ))}
              </div>

            </section>
          )}

          {/* Icon Section */}
          <section className="w-full mt-30">
            <ProgramPhase1 />
          </section>
          <section className="w-full mt-30">
            <ProgramPhase2 />
          </section>
          <section className="w-full mt-30">
            <ProgramPhase3 />
          </section>

          {/* Program Section */}
          <section id="program" className="w-full mt-30 scroll-mt-28">
            <ProgramDetailSection />
          </section>

          {/* Placeholder Image (Mobile Only) */}
          <section className="w-screen -mx-3 mt-30 md:hidden">
            <HalftoneHoverImage
              normalSrc="/images/home-community/placeholder.png"
              halftoneSrc="/images/home-community/placeholder-halftone.png"
              alt="Community Design-LAB."
              sizes="100vw"
            />
          </section>

          {/* Application Section */}
          <div className="w-full mt-30">
            <ApplicationSection />
          </div>

        </div>

        {/* Right Container */}
        <div className="w-full pb-40">
          {/* Statement Section*/}
          <section className="w-full mt-46">
            <StatementShort />

            <div className="w-full font-en text-lg md:text-base font-bold mt-12 flex justify-start">
              Community Design-LAB
            </div>
          </section>

          {/* Articles Section */}
          <section className="w-full mt-30 hidden md:block">
            <h2 className="font-en leading-none inline-block mb-10 text-primary">
              Article
            </h2>
            <div className="w-full flex flex-col gap-16">
              {communityLabArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

          </section>

        </div>

      </div>

    </div>
  );
}
