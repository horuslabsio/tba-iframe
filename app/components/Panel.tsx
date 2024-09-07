import { OpenNewIcon, TBALogo, WarnIcon } from "@/public/svg/Icons";
import strkLogo from "@/public/strk.png";
import ethLogo from "@/public/eth.png";
import daiLogo from "@/public/dai.png";
import usdcLogo from "@/public/usdc.png";
import usdtLogo from "@/public/usdt.png";
import { NetworkType } from "@/utils";
import CopyButton from "@/utils/CopyButton";
import { motion } from "framer-motion";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
const tabs = ["Collectibles", "Assets"];

type Props = {
  isVisible: boolean;
  setIsVisible: (value: SetStateAction<boolean>) => void;
  nftName: string;
  address: string;
  chain: NetworkType;
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
  collectibles: any[];
  ethBalance: number;
  strkBalance: number;
  daiBalance?: number | undefined;
  usdcBalance?: number | undefined;
  usdtBalance?: number | undefined;
};

const Panel = ({
  address,
  chain,
  isVisible,
  setIsVisible,
  nftName,
  activeTab,
  setActiveTab,
  collectibles,
  ethBalance,
  strkBalance,
  daiBalance,
  usdcBalance,
  usdtBalance,
}: Props) => {
  const onTabChange = (tab: number) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute left-0 top-0 z-10 ml-5 mt-5 w-fit cursor-pointer rounded-full border-2 border-transparent bg-customGray p-2 opacity-[0.7] mix-blend-difference hover:opacity-[0.9]"
      >
        <TBALogo />
      </button>

      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="absolute inset-0 mt-20 h-full w-full space-y-3 overflow-y-auto rounded-t-xl border-t-0 bg-white px-5 pt-5 no-scrollbar"
        >
          <div className="mb-4 flex items-center justify-center">
            <div className="h-[2.5px] w-[34px] bg-[#E4E4E4]" />
          </div>
          <div className="flex flex-col justify-start gap-2">
            <p>{nftName}</p>
            <div className="flex items-center justify-start">
              <div className="relative inline-block text-left">
                <div className="flex items-center justify-start">
                  <CopyButton
                    copyText={address}
                    buttonText={`${address.slice(0, 4)}...${address.slice(-3)}`}
                    className="rounded-2xl bg-[#F6F8FA] px-4 py-2 text-xs font-bold text-[#666D74]"
                  />
                </div>
              </div>

              <Link
                title="View in starkscan"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://${chain === "sepolia" ? "sepolia." : ""}starkscan.co/contract/${address}`}
                className="h-[20px] w-[20px] text-[#A1A1AA] transition-all hover:text-primary"
              >
                <OpenNewIcon />
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2 rounded-lg border-0 bg-[#d9d9ff] p-2">
            <div aria-hidden className="h-5 min-h-[20px] w-5 min-w-[20px]">
              <WarnIcon />
            </div>
            <p className="text-xs text-primary">
              Migrate your assets to V3 account for latest features.
            </p>
          </div>

          <div className="flex items-center justify-start space-x-4 border-b-[1px]">
            <div className="flex items-center justify-start space-x-4 border-b-[1px]">
              {tabs.map((tab, i) => (
                <div
                  onClick={() => onTabChange(i)}
                  key={i}
                  className={`${activeTab == i ? "border-b-2 pb-1 text-base font-normal text-primary hover:cursor-pointer" : "text-gray-500"} border-black pb-1 text-base font-normal hover:cursor-pointer`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>

          {activeTab == 0 && (
            <div className="py-4">
              {collectibles.length ? (
                <div className="grid grid-cols-1 gap-2 overflow-y-auto md:grid-cols-3">
                  {collectibles.map((_, i) => (
                    <div key={i} className="h-full w-full">
                      <Link
                        href="https://opensea.io/assets/ethereum/0x007af8ab4f1933c1e1512f344f132d0502b2ef33/0"
                        target="_blank"
                        className="cursor-pointer"
                      >
                        <div className="relative h-full w-full">
                          <img
                            className="aspect-square rounded-xl object-cover"
                            src="https://nft-cdn.alchemy.com/eth-mainnet/a74029fcf172f7b87a86ebf36ea4e64b"
                            alt="token image"
                            width="full"
                            height="full"
                          />
                          <div className="absolute left-4 top-4 rounded-lg bg-[#000] bg-opacity-10 px-2 py-1 text-white backdrop-blur-sm">
                            <div className="font-sans text-xl font-semibold md:text-2xl">
                              x1
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-lg font-bold text-black">
                  No collectibles yet!
                </p>
              )}
            </div>
          )}

          {activeTab == 1 && (
            <div className="flex flex-col gap-2">
              <div className="">
                <div className="flex items-center justify-between space-x-4 space-y-5">
                  <div className="flex items-center space-x-[10px]">
                    <img
                      src={strkLogo.src}
                      alt="logo"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <p className="font-normal text-primary">STRK</p>
                  </div>

                  <div>
                    <p className="text-base text-[#979797]">
                      {strkBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-between space-x-4 space-y-5">
                  <div className="flex items-center space-x-[10px]">
                    <img
                      src={ethLogo.src}
                      alt="logo"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <p className="font-normal text-primary">ETH</p>
                  </div>

                  <div>
                    <p className="text-base text-[#979797]">
                      {ethBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              {daiBalance !== undefined && (
                <div className="">
                  <div className="flex items-center justify-between space-x-4 space-y-5">
                    <div className="flex items-center space-x-[10px]">
                      <img
                        src={daiLogo.src}
                        alt="logo"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <p className="font-normal text-primary">Dai</p>
                    </div>

                    <div>
                      <p className="text-base text-[#979797]">
                        {daiBalance?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {usdcBalance !== undefined && (
                <div className="">
                  <div className="flex items-center justify-between space-x-4 space-y-5">
                    <div className="flex items-center space-x-[10px]">
                      <img
                        src={usdcLogo.src}
                        alt="logo"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <p className="font-normal text-primary">USDC</p>
                    </div>

                    <div>
                      <p className="text-base text-[#979797]">
                        {usdcBalance?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {usdtBalance !== undefined && (
                <div className="">
                  <div className="flex items-center justify-between space-x-4 space-y-5">
                    <div className="flex items-center space-x-[10px]">
                      <img
                        src={usdtLogo.src}
                        alt="logo"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <p className="font-normal text-primary">USDT</p>
                    </div>

                    <div>
                      <p className="text-base text-[#979797]">
                        {usdtBalance?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Panel;
