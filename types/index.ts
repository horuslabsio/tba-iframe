import { Dispatch, SetStateAction } from "react";

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

export type COLLECTABLE_TYPE = {
  assetAddress: string;
  assetTokenId: string;
  assetImage: string;
};

export type PanelProps = {
  isVisible: boolean;
  setIsVisible: (value: SetStateAction<boolean>) => void;
  nftName: string;
  address: string;
  lockedStatus: boolean;
  timeLeftToUnlock: string | undefined;
  chain: NetworkType;
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
  collectibles: COLLECTABLE_TYPE[];
  ethBalance: number;
  strkBalance: number;
  daiBalance?: number | undefined;
  usdcBalance?: number | undefined;
  usdtBalance?: number | undefined;
};
