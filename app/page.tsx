import { TBALogo2 } from "@/public/svg/Icons";

export default function Home() {
  return (
    <main className="grid h-screen grid-rows-5 items-center justify-between">
      <div className="row-span-4 text-center">
        <div className="mx-auto mb-4 flex w-fit gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full">
            <TBALogo2 />
          </div>

          <img
            src="./strk.png"
            alt="logo"
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>
        <h1 className="mb-4 text-xl font-bold">Token bound Iframe</h1>
        <a href="" className="text-blue-500 underline">
          visit docs
        </a>
      </div>
      <footer className="mt-auto h-20 w-screen bg-black text-white">
        <div className="p-6">
          <p className="text-center">Built with ❤️ by Horus Labs</p>
        </div>
      </footer>
    </main>
  );
}
