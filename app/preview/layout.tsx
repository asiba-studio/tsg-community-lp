import type { Metadata } from 'next';

// 下書きプレビュー専用ルート。全ページnoindex・動的レンダリング（draftKeyはURLに含まれる）。
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
    return children;
}
