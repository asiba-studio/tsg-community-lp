import { notFound } from 'next/navigation';
import { getArticleDraft } from 'lib/api';
import { ArticleDetailView } from 'components/articles/ArticleDetailView';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ draftKey?: string }>;
};

export default async function PreviewArticlePage({ params, searchParams }: Props) {
    const { id } = await params;
    const { draftKey } = await searchParams;
    if (!draftKey) notFound();

    const article = await getArticleDraft(id, draftKey);
    if (!article) notFound();
    return <ArticleDetailView article={article} draft />;
}
