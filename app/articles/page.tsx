
import { Metadata } from 'next';
import { Header } from 'components/layout';
import ArticleCard from 'components/home/ArticleCard';
import { getArticles } from 'lib/api';
import { Article, ProgramTerm, getPrimaryProgramTerm } from 'lib/types';

export const metadata: Metadata = {
  title: '記事一覧',
  description: 'Creative-Lab. の記事一覧です',
};

const TERM_GROUPS: { term: ProgramTerm; label: string }[] = [
  { term: 'COMMUNITY-LAB', label: 'COMMUNITY DESIGN-LAB.' },
  { term: '3RD', label: 'Creative-LAB. 3rd' },
  { term: '2ND', label: 'Creative-LAB. 2nd' },
];

function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[4vw] gap-y-16">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  const groups = TERM_GROUPS.map(({ term, label }) => ({
    term,
    label,
    articles: articles.filter((article) => getPrimaryProgramTerm(article.programTerms) === term),
  })).filter((group) => group.articles.length > 0);

  return (
    <div className="w-full pb-50">
      <Header />

      <div className="pt-30 px-[14px] lg:px-8">
        <h1 className="font-en font-bold text-3xl md:text-5xl leading-none text-primary">
          Article
        </h1>
        <p className="text-lg mt-6">
          COMMUNITY DESIGN-LAB. に関するレポートや対談をお届けします。
        </p>
      </div>

      <div className="w-full px-[14px] lg:px-8">
        {groups.map((group) => (
          <section
            key={group.term}
            className="w-full pt-30 section-spacing"
          >
            <h2 className="font-en font-bold text-3xl leading-none mb-8 text-primary">
              {group.label}
            </h2>
            <ArticleGrid articles={group.articles} />
          </section>
        ))}
      </div>
    </div>
  );
}
