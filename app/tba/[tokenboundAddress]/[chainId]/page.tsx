"use client";
import Panel from "@/app/components/Panel";
import { getOwnerNFT } from "@/hooks";
import { TBALogo2 } from "@/public/svg/Icons";
import {
  NetworkType,
  fetchNFTData,
  fetchTbaFungibleAssets,
  fetchTbaNonFungibleAssets,
  getChainData,
} from "@/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { num } from "starknet";

const TokenBound = () => {
  const { chainId, tokenboundAddress } = useParams<{
    tokenboundAddress: string;
    chainId: string;
  }>();
  const { network, url } = getChainData(chainId.toUpperCase());
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
    chain: NetworkType;
    ethBalance: number;
    strkBalance: number;
    daiBalance?: number;
    usdcBalance?: number;
    usdtBalance?: number;
  }>({
    address: "",
    chain: "",
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
      // const { network, url } = getChainData(chainId.toUpperCase());
      console.log(network);

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
  }, [network]);

  return (
    <main className="h-screen">
      <section className="container mx-auto flex h-full w-full lg:max-h-[100rem] lg:w-[50vw] lg:max-w-[100rem]">
        {nftLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full mix-blend-difference">
              <TBALogo2 />
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <div
              className={`h-full p-2 transition-all lg:min-w-[50vw] ${isVisible ? "h-full blur-sm" : "h-[80%] blur-0"}`}
            >
              <img
                src={nft?.image}
                className={`h-full w-full ${isVisible ? "object-cover" : "object-contain"} `}
                alt="NFT image"
              />
            </div>
            <Panel
              activeTab={activeTab}
              address={tokenboundAddress}
              collectibles={collectibles}
              chain={network}
              isVisible={isVisible}
              nftName={nft.name}
              setActiveTab={setActiveTab}
              setIsVisible={setIsVisible}
              ethBalance={tba.ethBalance}
              strkBalance={tba.strkBalance}
              daiBalance={tba.daiBalance}
              usdcBalance={tba.usdcBalance}
              usdtBalance={tba.usdtBalance}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default TokenBound;
