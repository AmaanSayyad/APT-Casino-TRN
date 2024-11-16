"use client";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet } from "viem/chains";
import { createConfig, WagmiProvider,http } from "wagmi";
const nibiChain = {
  id: 5115,
  name: "Nibiru Testnet-1",
  nativeCurrency: { name: "Nibiru Testnet-1", symbol: "NIBI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evm-rpc.testnet-1.nibiru.fi"] },
  },
  blockExplorers: {
    default: { name: "Testnet", url: "" },
  },
};
const evmNetworks = [
  {
    blockExplorerUrls: [""],
    chainId: 7210,
    chainName: "Nibiru Testnet-1",
    iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
    name: "Nibiru",
    nativeCurrency: {
      decimals: 18,
      name: "Nibiru Testnet-1",
      symbol: "nibi",
      iconUrl: "https://app.dynamic.xyz/assets/networks/eth.svg",
    },
    networkId: 7210,
    rpcUrls: [""],
    vanityName: "Nibiru Testnet-1",
  },
  {
    blockExplorerUrls: ['https://etherscan.io/'],
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    name: 'Ethereum',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
      iconUrl: 'https://app.dynamic.xyz/assets/networks/eth.svg',
    },
    networkId: 1,

    rpcUrls: ['https://mainnet.infura.io/v3/'],
    vanityName: 'ETH Mainnet',
  },
{
    blockExplorerUrls: ['https://etherscan.io/'],
    chainId: 5,
    chainName: 'Ethereum Goerli',
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    name: 'Ethereum',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
      iconUrl: 'https://app.dynamic.xyz/assets/networks/eth.svg',
    },
    networkId: 5,
    rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],

    vanityName: 'Goerli',
  },
  {
    blockExplorerUrls: ['https://polygonscan.com/'],
    chainId: 137,
    chainName: 'Matic Mainnet',
    iconUrls: ["https://app.dynamic.xyz/assets/networks/polygon.svg"],
    name: 'Polygon',
    nativeCurrency: {
      decimals: 18,
      name: 'MATIC',
      symbol: 'MATIC',
      iconUrl: 'https://app.dynamic.xyz/assets/networks/polygon.svg',
    },
    networkId: 137,
    rpcUrls: ['https://polygon-rpc.com'],
    vanityName: 'Polygon',
  },
];
const queryClient = new QueryClient();
const config = createConfig({
  chains: [mainnet, nibiChain],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [nibiChain.id]: http(),
  },
});
export default function Providers({ children }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "e2e630bf-3356-4dca-b0b9-71537b67ccf6",
        walletConnectors: [EthereumWalletConnectors],
        overrides: { evmNetworks },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
