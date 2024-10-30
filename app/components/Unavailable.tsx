import { TBALogo2 } from "@/public/svg/Icons";

const Unavailable = () => {
  return (
    <main className="grid h-screen items-center">
      <section className="container mx-auto flex h-full max-h-[100rem] w-full lg:w-[50vw] lg:max-w-[100rem]">
        <div className="my-auto grid h-[80%] w-full place-content-center gap-16 rounded-lg bg-white/25 text-center shadow-md shadow-[#d9d9ff]">
          <div className="mx-auto h-24 w-24 md:h-40 md:w-40">
            <TBALogo2 />
          </div>
          <p className="text-xl font-bold">
            Token bound Iframe is Currently Unavailable on Sepolia.💔{" "}
          </p>
        </div>
      </section>
    </main>
  );
};

export default Unavailable;
