

export default function Header() {

    return (
        <div className="
            sticky top-0 z-50 w-full h-12
            flex items-center
            backdrop-blur-md backdrop-saturate-300 bg-white/25
        ">
            <header className="w-full px-6">
                <nav className="flex justify-end items-center gap-8 font-en font-medium text-lg">
                    <div>About</div>
                    <div>Events</div>
                    <div>Players</div>
                    <div>Application</div>
                </nav>
            </header>
        </div>
    )
}

