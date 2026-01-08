import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { ENV } from "@/env";

export function getConnection() {
  const url = ENV.RPC_URL || clusterApiUrl(ENV.CLUSTER as any);
  return new Connection(url, "confirmed");
}

export function programId(): PublicKey {
  return new PublicKey(ENV.PROGRAM_ID);
}

export function mintPk(): PublicKey {
  return new PublicKey(ENV.MINT);
}

export function treasuryPk(): PublicKey {
  return new PublicKey(ENV.TREASURY);
}

export function getAnchorProvider(wallet: anchor.Wallet) {
  const conn = getConnection();
  return new anchor.AnchorProvider(conn, wallet, { commitment: "confirmed" });
}
