import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "ArtChain",
  projectId: "29a84e0ad59745d3be2bfa0a8a936bca", // Get this from WalletConnect Cloud
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet],
    },
  ],
});
