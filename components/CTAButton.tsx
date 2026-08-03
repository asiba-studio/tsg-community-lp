import { ReactNode } from 'react';

interface CTAButtonProps {
    href: string;
    children: ReactNode;
    className?: string;
}

// サイト共通のCTAボタン（幅いっぱい・角丸なし・アイコンなし）
export default function CTAButton({ href, children, className = '' }: CTAButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn w-full rounded-none text-base font-medium py-7 ${className}`}
        >
            {children}
        </a>
    );
}
