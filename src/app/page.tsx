
import HeroSection from "./components/heroSection";
import { StatementLeft, StatementCenter, StatementRight } from "./components/statement";
import { SimpleButton } from "@/components/button";



export default function Page() {
    return (
        <div>

            {/* Hero Section */}
            <section className="w-full h-[100vh]">
              <HeroSection></HeroSection>
            </section>


            {/* Main Container */}
            <div className="w-full h-[300vh] p-[100px] grid grid-cols-3 gap-[100px]">

              {/* Left Conteiner */}
              <div className="w-full col-span-2">

                {/* Left Statement Section */}
                <section className="w-full grid grid-cols-2 gap-[100px]">
                  <div>
                    <StatementLeft />
                  </div>
                  <div className="pt-[200px]">
                    <StatementCenter/>
                  </div>
                  

                </section>



              </div>

              {/* Right Container */}
              <div className="w-full col-span-1">
                <section className="w-full pt-[400px]">
                  <StatementRight />

                  <div className="w-full my-[100px] flex justify-end">
                    <SimpleButton icon="right">
                      About Creative Lab.
                    </SimpleButton>
                  </div>




                </section>

              </div>

            </div>
           
            
        </div>
    );
}
