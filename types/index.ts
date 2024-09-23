export type TBA_TYPE = {
  address: string;
  chain: NetworkType;
  locked: {
    status: boolean;
    timeLeftToUnlock: string | undefined;
  };
  ethBalance: number;
  strkBalance: number;
  daiBalance?: number;
  usdcBalance?: number;
  usdtBalance?: number;
};

export type NetworkType = "" | "mainnet" | "sepolia";
