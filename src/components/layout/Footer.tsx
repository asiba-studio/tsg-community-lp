

export default function Footer() {

    return (
        <footer className="w-full h-auto pt-20 pb-40 bg-[#1B1B24] flex flex-col items-center justify-center gap-20">
            <div className="text-base text-white">
                LOGO LOGO LOGO
            </div>
            <div className="flex gap-10">
                <div className="text-base text-white">About</div>
                <div className="text-base text-white">News</div>
                <div className="text-base text-white">Articles</div>
                <div className="text-base text-white">Players</div>
            </div>
            <div className="text-sm text-white">
                © {new Date().getFullYear()} あああああ. All rights reserved.
            </div>
        </footer>
    );
}