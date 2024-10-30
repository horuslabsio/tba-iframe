import {
  TBA_IMPLEMENTATION_HASH_MAINNET_V3,
  TBA_IMPLEMENTATION_HASH_SEPOLIA_V3,
  TBA_REGISTRY_ADDRESS_MAINNET_V3,
  TBA_REGISTRY_ADDRESS_SEPOLIA_V3,
  TBA_IMPLEMENTATION_HASH_MAINNET_V2,
  TBA_IMPLEMENTATION_HASH_SEPOLIA_V2,
  TBA_REGISTRY_ADDRESS_SEPOLIA_V2,
  TBA_REGISTRY_ADDRESS_MAINNET_V2,
} from "@/utils/constants";
import { formatTime, getProvider } from "@/utils";
import V3_REGISTRY_ABI from "../abis/v3/registry.abi.json";
import V3_ACCOUNT_ABI from "../abis/v3/account.abi.json";
import V2_REGISTRY_ABI from "../abis/v2/registry.abi.json";
import V2_ACCOUNT_ABI from "../abis/v2/account.abi.json";
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

  let v3address: BigNumberish | undefined;

  // v3 registry and implementation addresses
  const v3registryAddress =
    chain === "mainnet"
      ? TBA_REGISTRY_ADDRESS_MAINNET_V3
      : TBA_REGISTRY_ADDRESS_SEPOLIA_V3;
  const v3contract = new Contract(V3_REGISTRY_ABI, v3registryAddress, provider);
  const v3implementationAddress =
    chain === "mainnet"
      ? TBA_IMPLEMENTATION_HASH_MAINNET_V3
      : TBA_IMPLEMENTATION_HASH_SEPOLIA_V3;

  // v2 registry and implementation addresses
  const v2registryAddress =
    chain === "mainnet"
      ? TBA_REGISTRY_ADDRESS_MAINNET_V2
      : TBA_REGISTRY_ADDRESS_SEPOLIA_V2;
  const v2contract = new Contract(V2_REGISTRY_ABI, v2registryAddress, provider);
  const v2implementationAddress =
    chain === "mainnet"
      ? TBA_IMPLEMENTATION_HASH_MAINNET_V2
      : TBA_IMPLEMENTATION_HASH_SEPOLIA_V2;

  try {
    v3address = await v3contract.get_account(
      v3implementationAddress,
      tokenContract,
      tokenId,
      salt || tokenId,
      chain === "mainnet" ? "SN_MAIN" : "SN_SEPOLIA"
    );
    if (
      (await provider.getClassHashAt(v3address ? v3address : "")) ===
      v3implementationAddress
    ) {
      return v3address;
    }
  } catch (v3error) {
    console.error(`V3 error: ${v3error}`);
  }

  try {
    const v2address: BigNumberish = await v2contract.get_account(
      v2implementationAddress,
      tokenContract,
      tokenId,
      salt || tokenId
    );

    if (
      (await provider.getClassHashAt(v2address)) === v3implementationAddress
    ) {
      return v2address;
    } else if (
      (await provider.getClassHashAt(v2address)) === v2implementationAddress
    ) {
      return v2address;
    }
  } catch (v2error) {
    console.error(
      `Failed to get account with both V3 and V2 inputs. V3 error: ${v2error}`
    );
  }
  return v3address;
};

export const getOwnerNFT = async (params: {
  tbaAddress: string;
  jsonRPC: string;
}) => {
  const { jsonRPC, tbaAddress } = params;
  const provider = getProvider(jsonRPC);
  const contract = new Contract(V2_ACCOUNT_ABI, tbaAddress, provider);
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
  const contract = new Contract(V2_ACCOUNT_ABI, tbaAddress, provider);
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
