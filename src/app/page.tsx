
import HeroSection from "./components/heroSection";
import { StatementLeft, StatementCenter, StatementRight } from "./components/statement";
import { SimpleButton } from "@/components/button";
import ContentList from "@/components/articles/ContentList";
import { getArticles, getNews } from "@/lib/cms";
import { ProgramPhase1, ProgramPhase2, ProgramPhase3 } from "./components/ProgramPhase";
import { Header, Menu } from "@/components/layout";
import ProgramDetailSection from "./components/ProgramDetailSection";
import ApplicationSection from "./components/ApllicationSection";
import PlayerSection from "./components/PlayerSection";


export default async function Page() {

  const news = (await getNews());
  const articles = (await getArticles());

  return (
    <div>

      {/* Hero Section */}
      <section className="w-full h-[100vh] border-b border-border">
        <HeroSection />
      </section>

      {/* Navigation */}
      <Header />
      <div className="h-40"/>
      <Menu />
      

      {/* Main Container */}
      <div className="w-full -mt-40 p-[4vw] grid grid-cols-3 gap-[6vw]">

        {/* Left Conteiner */}
        <div className="w-full col-span-2">

          {/* Left Statement Section */}
          <section className="w-full grid grid-cols-2 gap-[6vw]">
            <div>
              <StatementLeft />
            </div>
            <div className="pt-[200px]">
              <StatementCenter />
            </div>
          </section>

          {/* News Section */}
          <section className="w-full mt-[200px] pt-[100px] border-t border-border">
            <h2>
              <img src="/gifs/news.gif" className="h-16 mb-10" alt="" />
              <span className="sr-only">News</span>
            </h2>
            <ContentList contents={news} basePath="/news" columns={2} gap={100} />
          </section>

          {/* Icon Section */}
          <section className="w-full section-spacing pb-4 border-t border-border">
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
          <div className="w-full section-spacing border-t border-border px-10">
            <ApplicationSection />
          </div>



        </div>

        {/* Right Container */}
        <div className="w-full col-span-1">
          {/* Statement Section*/}
          <section className="w-full pt-[400px]"　style={{ paddingBottom: 'var(--section-padding-y)' }}>
            <StatementRight />

            <div className="w-full my-[100px] flex justify-end">
              <SimpleButton icon="right" href="/articles">
                About Creative Lab.
              </SimpleButton>
            </div>
          </section>

          {/* Articles Section */}
          <section className="w-full section-spacing border-t border-border">
            <h2>
              <img src="/gifs/article.gif" className="h-16 mb-10" alt="" />
              <span className="sr-only">Article</span>
            </h2>
            <ContentList contents={articles} basePath="/articles" columns={1} gap={100}/>
          </section>

          {/* Players Section */}
          <section className="w-full section-spacing border-t border-border">
            <PlayerSection />
          </section>



        </div>

      </div>


    </div>
  );
}
