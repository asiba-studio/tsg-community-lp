export function DraftBanner() {
    return (
        <div className="fixed top-0 inset-x-0 z-[100] h-6 flex items-center justify-center gap-4 bg-black text-white">
            <span className="font-en font-bold text-[10px] tracking-normal">DRAFT PREVIEW</span>
            <a href="/" className="font-en font-bold text-[10px] underline underline-offset-2 hover:opacity-70">
                EXIT
            </a>
        </div>
    );
}
