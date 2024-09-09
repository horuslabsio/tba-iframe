import {
  TBA_CONTRACT_ADDRESS_MAINNET,
  TBA_CONTRACT_ADDRESS_SEPOLIA,
  TBA_IMPLEMENTATION_ACCOUNT_MAINNET,
  TBA_IMPLEMENTATION_ACCOUNT_SEPOLIA,
} from "@/app/utils/constants";
import REGISTRY_ABI from "../abis/registry.abi.json";
import ACCOUNT_ABI from "../abis/account.abi.json";
import { BigNumberish, Contract } from "starknet";
import { Dispatch, SetStateAction } from "react";
import { getProvider } from "@/app/helper";

export const getAccount = async (params: {
  tokenContract: string;
  tokenId: string;
  chain: "mainnet" | "sepolia" | "";
  jsonRPC: string;
  salt?: string;
}) => {
  const { tokenContract, tokenId, jsonRPC, chain, salt } = params;

  const provider = getProvider(jsonRPC);
  const registryAddress =
    chain === "mainnet"
      ? TBA_CONTRACT_ADDRESS_MAINNET
      : TBA_CONTRACT_ADDRESS_SEPOLIA;
  const contract = new Contract(REGISTRY_ABI, registryAddress, provider);
  const implementationAddress =
    chain === "mainnet"
      ? TBA_IMPLEMENTATION_ACCOUNT_MAINNET
      : TBA_IMPLEMENTATION_ACCOUNT_SEPOLIA;

  try {
    const address: BigNumberish = await contract.get_account(
      implementationAddress,
      tokenContract,
      tokenId,
      salt || tokenId
    );
    return address;
  } catch (error) {
    throw error;
  }
};

export const getOwnerNFT = async (params: {
  tbaAddress: string;
  jsonRPC: string;
}) => {
  const { jsonRPC, tbaAddress } = params;
  const provider = getProvider(jsonRPC);
  const contract = new Contract(ACCOUNT_ABI, tbaAddress, provider);
  try {
    const ownerNFT = await contract.token();
    return ownerNFT;
  } catch (error) {
    console.error("An error occurred while fetching the nft", error);
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
