export default function Home() {
  return (
    <main className="grid h-screen grid-rows-5 items-center justify-between">
      <div className="row-span-4 text-center">
        <img
          src="./strk.png"
          alt="logo"
          className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
        />
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
