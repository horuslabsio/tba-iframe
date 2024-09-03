import {
  TBA_CONTRACT_ADDRESS_MAINNET,
  TBA_CONTRACT_ADDRESS_SEPOLIA,
  TBA_IMPLEMENTATION_ACCOUNT_MAINNET,
  TBA_IMPLEMENTATION_ACCOUNT_SEPOLIA,
} from "@/utils/constants";
import { getProvider } from "@/utils";
import REGISTRY_ABI from "../app/abis/registry.abi.json";
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
