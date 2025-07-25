
import { StatementLeft, StatementCenter, StatementRight } from "../components/bbbStatement"
import { Header, Menu } from "@/components/layout/index";

export default function AboutPage() {
    return (
        <div>
            <Header />
            <Menu />

            <div className="w-full px-[14px] lg:px-[4vw] pt-20 flex flex-col lg:flex-row gap-[6vw] relative">

                {/* Left Container */}
                <section className="w-2/3 flex gap-[6vw]">
                    <div className="w-1/2">
                        <StatementLeft />
                    </div>
                    <div className="w-1/2 pt-40">
                        <StatementCenter />
                    </div>


                </section>

                {/* Right Container */}
                <div className="w-1/3 pt-80">
                    <section>
                        <StatementRight />
                    </section>

                </div>
            </div>
        </div>
    )
}

