import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { TORT } from "../config/tort";

export function getConnection() {
  return new Connection(TORT.RPC, "confirmed");
}

export async function getProvider(): Promise<anchor.AnchorProvider> {
  // Phantom / wallet adapter injected
  const anyWin = window as any;
  if (!anyWin?.solana?.isPhantom) {
    throw new Error("Phantom wallet non rilevato");
  }
  const wallet = new anchor.Wallet(anyWin.solana); // compat wrapper
  const provider = new anchor.AnchorProvider(getConnection(), wallet, {
    preflightCommitment: "confirmed",
  });
  anchor.setProvider(provider);
  return provider;
}

export async function getProgram() {
  const provider = await getProvider();
  const programId = new PublicKey(TORT.PROGRAM_ID);
  const idl = await anchor.Program.fetchIdl(programId, provider);
  if (!idl) throw new Error("IDL non trovata on-chain");

  // niente accounts custom nel coder (come negli script)
  const sanitized: any = JSON.parse(JSON.stringify(idl));
  sanitized.accounts = [];

  // firma classica: (idl, programId, provider)
  const ProgramAny = anchor.Program as any;
  const program: anchor.Program = new ProgramAny(sanitized, programId, provider);
  return { program, idl, provider, programId };
}

export function deriveStatePda(programId: PublicKey) {
  // PDA “state” di default; se hai PRESALE_PDA fisso usiamo quello
  if (TORT.PRESALE_PDA) return new PublicKey(TORT.PRESALE_PDA);
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from("state")], programId);
  return pda;
}
