import { Contract, RpcProvider } from "starknet";
import ERC20ABI from "../app/abis/token.abi.json";
import {
  DAI_TOKEN_DETAILS,
  ETHER_TOKEN_DETAILS,
  STARK_TOKEN_DETAILS,
  USDC_TOKEN_DETAILS,
  USDT_TOKEN_DETAILS,
} from "@/utils/constants";
import { Dispatch, SetStateAction } from "react";

export type NetworkType = "" | "mainnet" | "sepolia";

export function getProvider(jsonRPC: string) {
  const provider = new RpcProvider({
    nodeUrl: jsonRPC,
  });
  return provider;
}

export async function getBalance({
  address,
  jsonRPC,
  tokenAddress,
  tokenDecimal,
}: {
  address: string;
  jsonRPC: string;
  tokenAddress: string;
  tokenDecimal: number;
}) {
  const provider = getProvider(jsonRPC);
  let balance;
  if (provider) {
    const contract = new Contract(ERC20ABI, tokenAddress, provider);
    try {
      const res = await contract.balanceOf(address);
      balance = res?.balance?.low.toString() / tokenDecimal;
    } catch (error) {
      console.log(error);
    }
  }
  return balance;
}

export const fetchTbaFungibleAssets = async ({
  network,
  tbaAddress,
  setTba,
  onMainnet = false,
}: {
  network: "" | "mainnet" | "sepolia";
  tbaAddress: string;
  setTba: Dispatch<
    SetStateAction<{
      address: string;
      chain: NetworkType;
      ethBalance: number;
      strkBalance: number;
      daiBalance?: number | undefined;
      usdcBalance?: number | undefined;
      usdtBalance?: number | undefined;
    }>
  >;
  onMainnet?: boolean;
}) => {
  try {
    let currentDaiBalance: number | undefined = undefined;
    let currentUsdcBalance: number | undefined = undefined;
    let currentUsdtBalance: number | undefined = undefined;
    const ethBalance = await getBalance({
      address: tbaAddress,
      jsonRPC: `https://starknet-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      tokenAddress: ETHER_TOKEN_DETAILS.address,
      tokenDecimal: ETHER_TOKEN_DETAILS.decimal,
    });

    const strkBalance = await getBalance({
      address: tbaAddress,
      jsonRPC: `https://starknet-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      tokenAddress: STARK_TOKEN_DETAILS.address,
      tokenDecimal: STARK_TOKEN_DETAILS.decimal,
    });
    if (onMainnet) {
      const daiBalance = await getBalance({
        address: tbaAddress,
        jsonRPC: `https://starknet-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        tokenAddress: DAI_TOKEN_DETAILS.address,
        tokenDecimal: DAI_TOKEN_DETAILS.decimal,
      });
      currentDaiBalance = daiBalance;
      const usdcBalance = await getBalance({
        address: tbaAddress,
        jsonRPC: `https://starknet-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        tokenAddress: USDC_TOKEN_DETAILS.address,
        tokenDecimal: USDC_TOKEN_DETAILS.decimal,
      });
      currentUsdcBalance = usdcBalance;
      const usdtBalance = await getBalance({
        address: tbaAddress,
        jsonRPC: `https://starknet-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        tokenAddress: USDT_TOKEN_DETAILS.address,
        tokenDecimal: USDT_TOKEN_DETAILS.decimal,
      });
      currentUsdtBalance = usdtBalance;
    }
    setTba((prev) => ({
      ...prev,
      ethBalance: ethBalance || 0,
      strkBalance: strkBalance || 0,
      daiBalance: currentDaiBalance,
      usdcBalance: currentUsdcBalance,
      usdtBalance: currentUsdtBalance,
    }));
  } catch (error) {
    console.error("Error fetching TBA data", error);
  }
};
export const fetchTbaNonFungibleAssets = async ({
  address,
  url,
  setAssets,
}: {
  url: string;
  address: string;
  setAssets: Dispatch<SetStateAction<any[]>>;
}) => {
  const endpoint = `https://${url}/v1/owners/${address}/tokens`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_ARK_API_KEY || "",
    },
  });
  if (res.ok) {
    const data = await res.json();
    setAssets(data.result);
    console.log("all asset", data.result);
  }
};
export const getChainData = (
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

export const fetchNFTData = async ({
  endpoint,
  setLoading,
  setNft,
}: {
  endpoint: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setNft: Dispatch<
    SetStateAction<{
      image: string;
      name: string;
    }>
  >;
}) => {
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_ARK_API_KEY || "",
      },
    });
    if (response.ok) {
      const data = await response.json();
      const imageUrl = data.result.metadata.normalized.image;
      const imageName = data.result.metadata.normalized.name;

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        setNft({
          image: data.result.metadata.normalized.image,
          name: data.result.metadata.normalized.name,
        });
        setLoading(false);
      };

      img.onerror = (err) => {
        console.error("An error occurred while loading the image", err);
        setLoading(false);
      };
    }
  } catch (error) {
    console.error("An error occurred while fetching the nft", error);
  }
};
