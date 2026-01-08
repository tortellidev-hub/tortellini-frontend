// Minimal Phantom helpers (works on desktop + Phantom in-app browser)
import { Connection, PublicKey, Transaction, SendOptions } from "@solana/web3.js";
import { CONFIG } from "@/config/tort";

type SolanaProvider = {
  isPhantom?: boolean;
  publicKey?: PublicKey;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (tx: Transaction, opts?: SendOptions) => Promise<{ signature: string }>;
};

export function getConnection() {
  return new Connection(CONFIG.RPC_ENDPOINT, "confirmed");
}

export function getProvider(): SolanaProvider | null {
  if (typeof window === "undefined") return null;
  const anyWin = window as any;
  if (anyWin?.phantom?.solana && anyWin.phantom.solana.isPhantom) return anyWin.phantom.solana as SolanaProvider;
  if (anyWin?.solana && anyWin.solana.isPhantom) return anyWin.solana as SolanaProvider;
  return null;
}

export async function connectPhantom(): Promise<PublicKey> {
  const provider = getProvider();
  if (!provider) throw new Error("Phantom not found");
  const { publicKey } = await provider.connect();
  return publicKey;
}

export async function signAndSend(provider: SolanaProvider, tx: Transaction) {
  tx.recentBlockhash = (await getConnection().getLatestBlockhash("confirmed")).blockhash;
  return provider.signAndSendTransaction(tx);
}
