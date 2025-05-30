import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
  appName: 'ArtChain',
  projectId: '6f78cdf7872751dfe0d940d00b46ec21', // Get this from WalletConnect Cloud
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet]
    }
  ]
}) 