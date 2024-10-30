import {
  TBA_CONTRACT_ADDRESS_MAINNET,
  TBA_CONTRACT_ADDRESS_SEPOLIA,
  TBA_IMPLEMENTATION_ACCOUNT_MAINNET,
  TBA_IMPLEMENTATION_ACCOUNT_SEPOLIA,
} from "@/utils/constants";
import { formatTime, getProvider } from "@/utils";
import REGISTRY_ABI from "../app/abis/registry.abi.json";
import ACCOUNT_ABI from "../app/abis/account.abi.json";
import { BigNumberish, Contract } from "starknet";

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
    if (process.env.NODE_ENV !== "production") {
      console.error("An error occurred while fetching the nft", error);
    }
  }
};

export const getLockedStatus = async (params: {
  tbaAddress: string;
  jsonRPC: string;
}) => {
  const { jsonRPC, tbaAddress } = params;
  const provider = getProvider(jsonRPC);
  const contract = new Contract(ACCOUNT_ABI, tbaAddress, provider);
  try {
    const res = await contract.is_locked();

    const formatted_time = formatTime({
      seconds: Number(res["1"]),
    });

    return {
      status: res["0"],
      time: formatted_time,
    };
  } catch (error) {
    console.log("Error getting locked status: ", error);
  }
};
