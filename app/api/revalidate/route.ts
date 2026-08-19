import { createHmac, timingSafeEqual } from 'crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// MicroCMSのWebhook（コンテンツのWebhook設定 > シークレット）が送るペイロード:
// { service, api, id, type, contents?: { new, old } }
// シークレットを設定すると x-microcms-signature ヘッダーに HMAC-SHA256(secret, rawBody) の
// 16進文字列が付与される。https://blog.microcms.io/add-webhook-signature/
type MicroCMSWebhookPayload = {
    service?: string;
    api?: string;
    id?: string;
    type?: string;
};

function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
    if (!signature) return false;
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const expectedBuf = Buffer.from(expected, 'utf8');
    const signatureBuf = Buffer.from(signature, 'utf8');
    if (expectedBuf.length !== signatureBuf.length) return false;
    return timingSafeEqual(expectedBuf, signatureBuf);
}

export async function POST(request: Request) {
    const secret = process.env.MICROCMS_WEBHOOK_SECRET;
    if (!secret) {
        return new Response('MICROCMS_WEBHOOK_SECRET is not configured', { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get('x-microcms-signature');
    if (!isValidSignature(rawBody, signature, secret)) {
        return new Response('Invalid signature', { status: 401 });
    }

    let payload: MicroCMSWebhookPayload;
    try {
        payload = JSON.parse(rawBody);
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }

    // Next.js 16のrevalidateTagは第2引数(profile)必須。Webhook経由の外部更新は
    // 次のリクエストで確実に最新化してほしいため { expire: 0 } で即時失効させる
    revalidateTag('microcms-lp', { expire: 0 });

    return NextResponse.json({ revalidated: true, api: payload.api ?? null, id: payload.id ?? null });
}
