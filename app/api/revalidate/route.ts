import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
    const secret = request.headers.get('x-microcms-secret');
    if (secret !== process.env.MICROCMS_REVALIDATE_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    revalidateTag('microcms-lp', 'default');

    return NextResponse.json({ revalidated: true, now: Date.now() });
}