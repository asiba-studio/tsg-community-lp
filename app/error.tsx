'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center text-text-primary">
            <p className="font-en text-7xl">ERROR</p>
            <p className="mt-6 text-sm">SOMETHING WENT WRONG</p>
            <button
                onClick={() => reset()}
                className="mt-2 underline underline-offset-4"
            >
                TRY AGAIN
            </button>
        </div>
    );
}
