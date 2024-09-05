"use client";
import { HambugerIcon } from "@/app/assets/Icons";
import { getOwnerNFT } from "@/hooks";
import {
  fetchNFTData,
  fetchTbaFungibleAssets,
  fetchTbaNonFungibleAssets,
  getChainData,
} from "@/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { num } from "starknet";

const TokenBound = () => {
  const { chainId, tokenboundAddress } = useParams<{
    tokenboundAddress: string;
    chainId: string;
  }>();

  const tabs = ["Collectibles", "Assets"];

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const [activeTab, setActiveTab] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  const [nft, setNft] = useState({
    image: "",
    name: "",
  });
  const [nftLoading, setNftLoading] = useState(true);
  const [collectibles, setCollectibles] = useState<any[]>([]);

  const [tba, setTba] = useState<{
    address: string;
    ethBalance: number;
    strkBalance: number;
    daiBalance?: number;
    usdcBalance?: number;
    usdtBalance?: number;
  }>({
    address: "",
    ethBalance: 0,
    strkBalance: 0,
    daiBalance: undefined,
    usdcBalance: undefined,
    usdtBalance: undefined,
  });
  useEffect(() => {
    const fetchOwnerNFT = async ({
      network,
      url,
    }: {
      network: "" | "mainnet" | "sepolia";
      url: string | undefined;
    }) => {
      const owner = await getOwnerNFT({
        jsonRPC: `https://starknet-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        tbaAddress: tokenboundAddress,
      });
      const ownerAddress = num.toHex(owner[0]);
      const ownerTokenId = owner[1].toString();
      const END_POINT = `https://${url}/v1/tokens/${ownerAddress}/${ownerTokenId}`;
      fetchNFTData({
        endpoint: END_POINT,
        setLoading: setNftLoading,
        setNft: setNft,
      });
    };
    if (chainId && tokenboundAddress) {
      const { network, url } = getChainData(chainId.toUpperCase());
      fetchOwnerNFT({ network, url });
      fetchTbaNonFungibleAssets({
        address: tokenboundAddress,
        url: url || "",
        setAssets: setCollectibles,
      });
      fetchTbaFungibleAssets({
        network,
        tbaAddress: tokenboundAddress,
        setTba,
        onMainnet: network === "mainnet",
      });
    }
  }, []);

  const onTabChange = (tab: number) => {
    setActiveTab(tab);
  };

  return (
    <main className="flex h-[100vh] w-full justify-center overflow-hidden bg-slate-100">
      {nftLoading ? (
        <div className="flex items-center justify-center text-black">
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      ) : (
        <div className="relative h-[120vh] w-full bg-cover bg-center lg:min-w-[50rem] lg:max-w-[50rem]">
          <div className={`w-full items-center justify-center`}>
            <div className="flex w-full items-center justify-center">
              <img
                src={nft?.image}
                className={`h-full w-full object-contain`}
                alt="Background"
              />
            </div>
          </div>

          <div className="">
            <div
              onClick={() => setIsVisible(!isVisible)}
              className="absolute left-0 top-0 z-10 ml-5 mt-5 w-fit cursor-pointer rounded-full border-2 border-transparent bg-customGray p-2 opacity-[0.7] hover:opacity-[0.9]"
            >
              TBA
            </div>
            {isVisible && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="absolute inset-0 mt-20 h-[87%] w-full max-w-[1080px] space-y-3 overflow-y-auto rounded-t-xl border-t-0 bg-white px-5 pt-5 no-scrollbar"
              >
                <div className="mb-4 flex items-center justify-center">
                  <div className="h-[2.5px] w-[34px] bg-[#E4E4E4]" />
                </div>
                <div className="flex items-center justify-start space-x-2">
                  <div className="flex items-center justify-start space-x-2">
                    <div className="relative inline-block text-left">
                      <div className="flex items-center justify-start space-x-2">
                        <div className="inline-block rounded-2xl bg-[#F6F8FA] px-4 py-2 text-xs font-bold text-[#666D74] hover:cursor-pointer">
                          {`${tba.address.slice(0, 4)}...${tba.address.slice(-3)}`}
                        </div>
                      </div>
                    </div>

                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://etherscan.io/address/0x718a9D173E66C411f48E41d3dA2fa6f0CE8f5D3c"
                      className="h-[20px] w-[20px] cursor-pointer"
                    >
                      <HambugerIcon />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center space-x-2 rounded-lg border-0 bg-[#d9d9ff] p-2">
                  <div className="h-5 min-h-[20px] w-5 min-w-[20px]">
                    <svg
                      id="Layer_2"
                      data-name="Layer 2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 26.23 26.23"
                    >
                      <defs></defs>
                      <g id="Layer_1-2" data-name="Layer 1">
                        <g>
                          <path
                            fill="#0C0C4F"
                            d="m13.12,0c-1.72,0-3.43.34-5.02,1-1.59.66-3.04,1.63-4.26,2.84C1.38,6.3,0,9.64,0,13.12s1.38,6.82,3.84,9.28c1.22,1.22,2.66,2.18,4.26,2.84,1.59.66,3.3,1,5.02,1,3.48,0,6.82-1.38,9.28-3.84,2.46-2.46,3.84-5.8,3.84-9.28,0-1.72-.34-3.43-1-5.02-.66-1.59-1.63-3.04-2.84-4.26-1.22-1.22-2.66-2.18-4.26-2.84-1.59-.66-3.3-1-5.02-1Z"
                          ></path>
                          <g>
                            <rect
                              fill="#ffffff"
                              x="11.81"
                              y="6.56"
                              width="2.62"
                              height="7.87"
                            ></rect>
                            <rect
                              fill="#ffffff"
                              x="11.81"
                              y="17.05"
                              width="2.62"
                              height="2.62"
                            ></rect>
                          </g>
                        </g>
                      </g>
                    </svg>
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
                    {/* <div className="grid grid-cols-1 gap-2 overflow-y-auto md:grid-cols-3">
                    {Array(8)
                      .fill(0)
                      .map((_, i) => (
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
                  </div> */}
                    <p className="text-center text-lg font-bold text-black">
                      No collectibles yet!
                    </p>
                  </div>
                )}

                {activeTab == 1 && (
                  <div className="">
                    <div className="py-4">
                      <div className="flex items-center justify-between space-x-4 space-y-5">
                        <div className="flex items-center space-x-[10px]">
                          <img
                            src="https://www.starknet.io/wp-content/uploads/2024/04/sn-symbol-gradient.png"
                            alt="logo"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <p className="font-normal text-primary">Stark</p>
                        </div>

                        <div>
                          <p className="text-base text-[#979797]">
                            {tba?.strkBalance}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-4">
                      <div className="flex items-center justify-between space-x-4 space-y-5">
                        <div className="flex items-center space-x-[10px]">
                          <img
                            src="https://iframe-tokenbound.vercel.app/ethereum-logo.png"
                            alt="logo"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <p className="font-normal text-primary">Ethereum</p>
                        </div>

                        <div>
                          <p className="text-base text-[#979797]">
                            {tba?.ethBalance}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-4">
                      <div className="flex items-center justify-between space-x-4 space-y-5">
                        <div className="flex items-center space-x-[10px]">
                          <img
                            src="https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png"
                            alt="logo"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <p className="font-normal text-primary">Dai</p>
                        </div>

                        <div>
                          <p className="text-base text-[#979797]">
                            {tba?.daiBalance}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-4">
                      <div className="flex items-center justify-between space-x-4 space-y-5">
                        <div className="flex items-center space-x-[10px]">
                          <img
                            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                            alt="logo"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <p className="font-normal text-primary">USDC</p>
                        </div>

                        <div>
                          <p className="text-base text-[#979797]">
                            {tba?.usdcBalance}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-4">
                      <div className="flex items-center justify-between space-x-4 space-y-5">
                        <div className="flex items-center space-x-[10px]">
                          <img
                            src="https://cryptologos.cc/logos/tether-usdt-logo.png"
                            alt="logo"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <p className="font-normal text-primary">USDT</p>
                        </div>

                        <div>
                          <p className="text-base text-[#979797]">
                            {tba?.usdtBalance}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default TokenBound;
