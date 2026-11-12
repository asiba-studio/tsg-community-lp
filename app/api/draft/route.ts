import { redirect } from 'next/navigation';

// MicroCMSの各API設定 > 画面プレビュー > プレビューURLに以下を設定する:
//   https://tsg-community.asiba.or.jp/api/draft?secret=<MICROCMS_DRAFT_SECRET>&contentId={CONTENT_ID}&draftKey={DRAFT_KEY}&type=article
//   https://tsg-community.asiba.or.jp/api/draft?secret=<MICROCMS_DRAFT_SECRET>&contentId={CONTENT_ID}&draftKey={DRAFT_KEY}&type=news
// {CONTENT_ID}/{DRAFT_KEY} はmicroCMS側がプレビュー時に実値へ置換する変数。
//
// secret照合後に /preview/<type>/<id>?draftKey=... へredirectするだけの入り口。
// draftMode()のcookieには依存せず、redirect後のURLに含まれるdraftKey自体が閲覧の認可情報になる。
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const contentId = searchParams.get('contentId');
    const draftKey = searchParams.get('draftKey');
    const type = searchParams.get('type');

    const expectedSecret = process.env.MICROCMS_DRAFT_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
        return new Response('Invalid secret', { status: 401 });
    }
    if (!contentId || !draftKey) {
        return new Response('Missing contentId or draftKey', { status: 400 });
    }
    if (type !== 'article' && type !== 'news') {
        return new Response('type must be "article" or "news"', { status: 400 });
    }

    const basePath = type === 'article' ? '/preview/articles' : '/preview/news';
    redirect(`${basePath}/${encodeURIComponent(contentId)}?draftKey=${encodeURIComponent(draftKey)}`);
}
