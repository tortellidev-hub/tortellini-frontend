"use client";

import { ReactNode, useMemo } from "react";
import { ENV } from "@/env";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

export default function SolanaWalletProvider({ children }: { children: ReactNode }) {
  // Se non hai NEXT_PUBLIC_CLUSTER in .env.local resta “devnet” e non cambia nulla
  const network = (ENV.CLUSTER || "devnet") as WalletAdapterNetwork;
  const endpoint = ENV.RPC_URL;

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: ENV.COMMITMENT }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
