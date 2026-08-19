import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center text-text-primary">
            <p className="font-en text-7xl">404</p>
            <p className="mt-6 text-sm">PAGE NOT FOUND</p>
            <Link href="/" className="mt-2 underline underline-offset-4">
                BACK TO HOME
            </Link>
        </div>
    );
}
