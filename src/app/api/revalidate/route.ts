import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
    // 1. シークレットキーの確認（セキュリティ）
    const secret = request.headers.get('x-contentful-secret');
    if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // 2. タグを指定してキャッシュをパージ
    // これにより 'contentful-lp' タグがついた fetch だけが再取得されます
    revalidateTag('contentful-lp');

    return NextResponse.json({ revalidated: true, now: Date.now() });
}