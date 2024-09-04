"use client";
import { getAccount } from "@/hooks";
import {
  fetchNFTData,
  fetchTbaFungibleAssets,
  fetchTbaNonFungibleAssets,
  getChainData,
} from "@/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { num } from "starknet";

type NetworkType = "" | "mainnet" | "sepolia";

const Token = () => {
  const { chainId, contractAddress, tokenId } = useParams<{
    contractAddress: string;
    tokenId: string;
    chainId: string;
  }>();

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
    daiBalance: 0,
    usdcBalance: 0,
    usdtBalance: 0,
  });
  const [nft, setNft] = useState({
    image: "",
    name: "",
  });
  const [imageLoading, setImageLoading] = useState(true);

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
      console.log("Address:", num.toHex(tbaAddress));
      setTba((prev) => {
        return {
          ...prev,
          address: tbaAddress,
        };
      });
      fetchTbaNonFungibleAssets({ address: tbaAddress, url: url || "" });
      fetchTbaFungibleAssets({
        network,
        tbaAddress,
        setTba,
        onMainnet: network === "mainnet",
      });
    }
  };

  useEffect(() => {
    const { network, url } = getChainData(chainId.toUpperCase());
    const END_POINT = `https://${url}/v1/tokens/${contractAddress}/${tokenId}`;
    fetchNFTData({
      endpoint: END_POINT,
      setLoading: setImageLoading,
      setNft: setNft,
    });
    fetchTBA({ network: network, url: url });
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      {imageLoading ? (
        <p>loading..</p>
      ) : (
        <div className="relative h-full max-h-[1024px] w-full max-w-[1024px]">
          <div className="absolute left-0 top-0 p-8">
            <button>open panel</button>
          </div>
          <img
            src={nft.image}
            alt={"image of NFT"}
            className="h-full w-full object-cover"
          />
          <section className="absolute bottom-0 h-[70%] w-full">
            <p>{nft.name}</p>
            <p>{tba.address}</p>
            <p>{tba.ethBalance}</p>
            <p>{tba.strkBalance}</p>
            <p>{tba.daiBalance}</p>
            <p>{tba.usdcBalance}</p>
            <p>{tba.usdtBalance}</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default Token;
