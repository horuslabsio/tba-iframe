"use client";
import { getAccount } from "@/hooks";
import { getBalance } from "@/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ETHER_TOKEN_DETAILS, STARK_TOKEN_DETAILS } from "@/utils/constants";
import { num } from "starknet";

type NetworkType = "" | "mainnet" | "sepolia";

const Token = () => {
  const { chainId, contractAddress, tokenId } = useParams<{
    contractAddress: string;
    tokenId: string;
    chainId: string;
  }>();
  const [tba, setTba] = useState({
    address: "",
    ethBalance: 0,
    strkBalance: 0,
  });
  const [nft, setNft] = useState({
    image: "",
    name: "",
  });

  const [imageLoading, setSetImageLoading] = useState(true);

  const getChainData = (
    id: string
  ): {
    network: "mainnet" | "sepolia" | "";
    url: string | undefined;
  } => {
    switch (id) {
      case "SN_MAIN":
        return {
          network: "mainnet",
          url: process.env.NEXT_PUBLIC_NETWORK_MAINNET,
        };
      case "SN_SEPOLIA":
        return {
          network: "sepolia",
          url: process.env.NEXT_PUBLIC_NETWORK_SEPOLIA,
        };

      default:
        return {
          network: "",
          url: process.env.NEXT_PUBLIC_NETWORK_SEPOLIA,
        };
    }
  };

  const fetchNFTData = async (END_POINT: string) => {
    try {
      const response = await fetch(END_POINT, {
        method: "GET",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_ARK_API_KEY || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNft({
          image: data.result.metadata.normalized.image,
          name: data.result.metadata.normalized.name,
        });

        setSetImageLoading(false);
      }
    } catch (error) {
      console.error("An error occurred while fetching the nft", error);
    }
  };

  const fetchTBAAssets = async (tbaAddress: string) => {
    try {
      const ethBalance = await getBalance({
        address: tbaAddress,
        jsonRPC: `https://starknet-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        tokenAddress: ETHER_TOKEN_DETAILS.address,
        tokenDecimal: ETHER_TOKEN_DETAILS.decimal,
      });

      const strkBalance = await getBalance({
        address: tbaAddress,
        jsonRPC: `https://starknet-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        tokenAddress: STARK_TOKEN_DETAILS.address,
        tokenDecimal: STARK_TOKEN_DETAILS.decimal,
      });

      setTba((prev) => ({
        ...prev,
        ethBalance: ethBalance || 0,
        strkBalance: strkBalance || 0,
      }));
    } catch (error) {
      console.error("Error fetching TBA data", error);
    }
  };

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
      const endpoint = `https://${url}/v1/owners/${tbaAddress}/tokens`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_ARK_API_KEY || "",
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("all asset", data);
      }
      fetchTBAAssets(tbaAddress);
    }
  };

  useEffect(() => {
    const { network, url } = getChainData(chainId);
    const END_POINT = `https://${url}/v1/tokens/${contractAddress}/${tokenId}`;
    fetchNFTData(END_POINT);
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
          </section>
        </div>
      )}
    </div>
  );
};

export default Token;
