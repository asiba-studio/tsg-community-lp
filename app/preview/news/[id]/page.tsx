import { notFound } from 'next/navigation';
import { getNewsDraft } from 'lib/api';
import { NewsDetailView } from 'components/articles/NewsDetailView';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ draftKey?: string }>;
};

export default async function PreviewNewsPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { draftKey } = await searchParams;
    if (!draftKey) notFound();

    const news = await getNewsDraft(id, draftKey);
    if (!news) notFound();
    return <NewsDetailView news={news} draft />;
}
