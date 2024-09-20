"use client";
import { getAccount } from "@/hooks";
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
import { TBALogo2 } from "@/public/svg/Icons";
import Panel from "@/app/components/Panel";

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
    const alchemyBaseUrl = process.env.NEXT_PUBLIC_ALCHEMY_BASE_URL?.replace(
      "%network%",
      network
    );
    const resAddress = await getAccount({
      chain: network,
      jsonRPC: `${alchemyBaseUrl}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
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
    const END_POINT = `${url}/tokens/${contractAddress}/${tokenId}`;
    fetchNFTData({
      endpoint: END_POINT,
      setLoading: setLoading,
      setNft: setNft,
    });
    fetchTBA({ network: network, url: url });
  }, []);

  return (
    <main className="grid h-screen items-center">
      <section className="container mx-auto flex h-full max-h-[100rem] w-full lg:w-[50vw] lg:max-w-[100rem]">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full text-[#d9d9d966] mix-blend-difference">
              <TBALogo2 />
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <div
              className={`grid h-full place-content-center transition-all ${isVisible ? "px-0 blur-sm" : "px-2 blur-0"}`}
            >
              <div className="h-[85vh] max-h-[100rem]">
                <img
                  src={nft?.image}
                  className={`h-full w-full ${isVisible ? "object-cover" : "object-contain"} `}
                  alt="NFT image"
                />
              </div>
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
