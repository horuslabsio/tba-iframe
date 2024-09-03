import { Contract, RpcProvider } from "starknet";
import ERC20ABI from "../app/abis/token.abi.json";

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
