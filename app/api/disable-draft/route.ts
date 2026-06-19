import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    (await draftMode()).disable();

    const referer = request.headers.get('referer');
    const redirectUrl = referer ? new URL(referer).pathname : '/';
    redirect(redirectUrl);
}
