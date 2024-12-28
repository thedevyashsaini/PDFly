import { auth } from "./actions";
import { Spotlight } from "@/components/ui/spotlight";
import NextButton from "@/components/home-next-btn";

export default async function Home() {
  const subject = await auth();

  return (
    <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="pink" />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          PDFly <br />{" "}
          <span className="text-2xl md:text-4xl flex w-full justify-center my-4">
            Talk to your PDFs, <br />
            they&apos;ll show you what&apos;s inside!
          </span>
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Turn your PDFs into conversations! With PDFly, you can simply ask
          questions, and your documents will deliver the answers you need. No
          more endless scrolling—just smarter, faster insights.
        </p>
        <NextButton subject={subject}/>
      </div>
    </div>
  );
}
