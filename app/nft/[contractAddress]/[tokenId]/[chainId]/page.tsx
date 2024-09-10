"use client";
import { getAccount, fetchNFTData } from "@/app/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { num } from "starknet";
import { TBALogo2 } from "@/public/svg/Icons";
import Panel from "@/app/components/Panel";
import {
  NetworkType,
  fetchTbaFungibleAssets,
  fetchTbaNonFungibleAssets,
  getChainData,
} from "@/app/helper";

const Token = () => {
  const { chainId, contractAddress, tokenId } = useParams<{
    contractAddress: string;
    tokenId: string;
    chainId: string;
  }>();
  const { network, url } = getChainData(chainId.toUpperCase());
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nft, setNft] = useState({
    image: "",
    name: "",
  });
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
    daiBalance: 0,
    usdcBalance: 0,
    usdtBalance: 0,
  });

  const fetchTBA = async ({
    network,
    url,
  }: {
    network: NetworkType;
    url: string | undefined;
  }) => {
    const resAddress = await getAccount({
      chain: network,
      jsonRPC: `https://starknet-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      tokenContract: contractAddress,
      tokenId: tokenId,
    });
    const tbaAddress = num.toHex(resAddress);
    if (tbaAddress) {
      setTba((prev) => {
        return {
          ...prev,
          address: tbaAddress,
          chain: network,
        };
      });
      fetchTbaNonFungibleAssets({
        address: tbaAddress,
        url: url || "",
        setAssets: setCollectibles,
      });
      fetchTbaFungibleAssets({
        network,
        tbaAddress,
        setTba,
        onMainnet: network === "mainnet",
      });
    }
  };

  useEffect(() => {
    const END_POINT = `https://${url}/v1/tokens/${contractAddress}/${tokenId}`;
    fetchNFTData({
      endpoint: END_POINT,
      setLoading: setLoading,
      setNft: setNft,
    });
    fetchTBA({ network: network, url: url });
  }, []);

  return (
    <main className="grid h-screen items-center">
      <section className="container mx-auto flex h-full w-full lg:max-h-[100rem] lg:w-[50vw] lg:max-w-[100rem]">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full text-[#d9d9d966] mix-blend-difference">
              <TBALogo2 />
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <div
              className={`h-full p-2 transition-all ${isVisible ? "h-full blur-sm" : "h-[80%] blur-0"}`}
            >
              <img
                src={nft?.image}
                className={`h-full w-full ${isVisible ? "object-cover" : "object-contain"} `}
                alt="NFT image"
              />
            </div>
            <Panel
              activeTab={activeTab}
              address={tba.address}
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

export default Token;
