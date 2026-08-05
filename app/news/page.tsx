import { Metadata } from 'next';
import { Header } from 'components/layout';
import NewsCard from 'components/home/NewsCard';
import { getNews } from 'lib/api';
import { News, ProgramTerm, getPrimaryProgramTerm } from 'lib/types';

export const metadata: Metadata = {
  title: 'ニュース一覧',
  description: 'Creative-Lab. のニュース一覧です',
};

const TERM_GROUPS: { term: ProgramTerm; label: string }[] = [
  { term: 'COMMUNITY-LAB', label: 'COMMUNITY DESIGN-LAB.' },
  { term: '3RD', label: 'Creative-LAB. 3rd' },
  { term: '2ND', label: 'Creative-LAB. 2nd' },
];

function NewsGrid({ news }: { news: News[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[4vw] gap-y-16">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}

export default async function NewsPage() {
  const news = await getNews();

  const groups = TERM_GROUPS.map(({ term, label }) => ({
    term,
    label,
    news: news.filter((item) => getPrimaryProgramTerm(item.programTerms) === term),
  })).filter((group) => group.news.length > 0);

  return (
    <div className="w-full pb-50">
      <Header />

      <div className="pt-14 md:pt-30 px-3 lg:px-8">
        <h1 className="font-en font-bold text-3xl md:text-5xl leading-none text-primary">
          News
        </h1>
        <p className="text-base md:text-lg mt-6">
          COMMUNITY DESIGN-LAB. に関するお知らせをお届けします。
        </p>
      </div>

      <div className="w-full px-3 lg:px-8">
        {groups.map((group) => (
          <section
            key={group.term}
            className="w-full pt-14 md:pt-30 section-spacing"
          >
            <h2 className="font-en font-bold text-2xl md:text-3xl leading-none mb-2 md:mb-8 text-primary">
              {group.label}
            </h2>
            <NewsGrid news={group.news} />
          </section>
        ))}
      </div>
    </div>
  );
}
