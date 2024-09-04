"use client";
import { getOwnerNFT } from "@/hooks";
import {
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

  const [nft, setNft] = useState({
    image: "",
    name: "",
  });
  const [nftLoading, setNftLoading] = useState(true);
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
      fetchTbaNonFungibleAssets({ address: tokenboundAddress, url: url || "" });
      fetchTbaFungibleAssets({
        network,
        tbaAddress: tokenboundAddress,
        setTba,
        onMainnet: network === "mainnet",
      });
    }
  }, []);

  return (
    <section>
      {nftLoading ? (
        <p>loading..</p>
      ) : (
        <div className="relative h-full max-h-[1024px] w-full max-w-[1024px]">
          <div className="absolute left-0 top-0 p-8">
            <button>open panel 3</button>
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
            {tba.daiBalance && <p>{tba.daiBalance}</p>}
            {tba.usdcBalance && <p>{tba.usdcBalance}</p>}
            {tba.usdtBalance && <p>{tba.usdtBalance}</p>}
          </section>
        </div>
      )}
    </section>
  );
};

export default TokenBound;
