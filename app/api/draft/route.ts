import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { client } from 'lib/api';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const secret = searchParams.get('secret');
    const contentId = searchParams.get('contentId');
    const draftKey = searchParams.get('draftKey');
    const type = searchParams.get('type');

    if (secret !== process.env.MICROCMS_DRAFT_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!contentId || !draftKey) {
        return NextResponse.json({ message: 'Missing contentId or draftKey' }, { status: 400 });
    }

    if (type !== 'article' && type !== 'news') {
        return NextResponse.json({ message: 'Invalid type. Use "article" or "news"' }, { status: 400 });
    }

    const endpoint = type === 'article' ? 'article' : 'news';

    let entry: { slug?: string; id: string };
    try {
        entry = await client.get<{ slug?: string; id: string }>({
            endpoint,
            contentId,
            queries: { draftKey },
        });
    } catch {
        return NextResponse.json({ message: 'Content not found in MicroCMS' }, { status: 404 });
    }

    const slug = entry.slug || entry.id;
    const basePath = type === 'article' ? '/articles' : '/news';

    (await draftMode()).enable();

    redirect(`${basePath}/${slug}?draftKey=${draftKey}&contentId=${contentId}`);
}
