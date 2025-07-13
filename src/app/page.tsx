
import HeroSection from "./components/heroSection";
import { StatementLeft, StatementCenter, StatementRight } from "./components/statement";
import { SimpleButton } from "@/components/button";
import { ArticleList } from "@/components/articles";
import { getArticles } from "@/lib/cms";
import { ProgramPhase1 } from "./components/ProgramPhase";
import ArticlesPage from "./articles/page";



export default async function Page() {

  const articles = (await getArticles()).slice(0, 2);
  // タイトル順
  const byTitle = [...articles].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div>

      {/* Hero Section */}
      <section className="w-full h-[100vh]">
        <HeroSection></HeroSection>
      </section>


      {/* Main Container */}
      <div className="w-full p-[100px] grid grid-cols-3 gap-[100px]">

        {/* Left Conteiner */}
        <div className="w-full col-span-2">

          {/* Left Statement Section */}
          <section className="w-full grid grid-cols-2 gap-[100px]">
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
              <img src="/gifs/news.gif" className="h-[2.5em] mb-10" alt="" />
              <span className="sr-only">News</span>
            </h2>
            <ArticleList articles={byTitle} columns={2} gap={100} />
          </section>

          {/* Icon Section */}
          <section className="w-full mt-[200px] pt-[100px] border-t border-border">
            <ProgramPhase1 />
          </section>
          <section className="w-full mt-[200px] pt-[100px] border-t border-border">
            <ProgramPhase1 />
          </section>
          <section className="w-full mt-[200px] pt-[100px] border-t border-border">
            <ProgramPhase1 />
          </section>



        </div>

        {/* Right Container */}
        <div className="w-full col-span-1">
          {/* Statement Section*/}
          <section className="w-full pt-[400px]">
            <StatementRight />

            <div className="w-full my-[100px] flex justify-end">
              <SimpleButton icon="right" href="/articles">
                About Creative Lab.
              </SimpleButton>
            </div>
          </section>

          {/* News Section */}
          <section>
            <ArticleList articles={byTitle} columns={1} gap={100}/>
          </section>



        </div>

      </div>


    </div>
  );
}
