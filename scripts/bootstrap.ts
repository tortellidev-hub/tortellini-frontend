import * as anchor from "@coral-xyz/anchor";
import {PublicKey, SystemProgram, LAMPORTS_PER_SOL} from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("EbS2PrDyxBfbEdSQA64jLQTyhCARsDcELr4kUMoG8YK2"); // deve combaciare con declare_id!

const SEED_STATE = Buffer.from("state");
const SEED_PRESALE_VAULT_AUTH_V1 = Buffer.from("presale_vault_auth_v1");

async function main() {
  const MINT = new PublicKey(process.env.MINT!);
  const TREASURY = new PublicKey(process.env.TREASURY!);

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const idl = await anchor.Program.fetchIdl(PROGRAM_ID, provider);
  if (!idl) throw new Error("IDL not found on chain (hai fatto anchor deploy?)");
  const program = new anchor.Program(idl, PROGRAM_ID, provider);

  // 1) PDA state
  const [state] = PublicKey.findProgramAddressSync([SEED_STATE], PROGRAM_ID);

  // 2) initialize (se l'account esiste già, ignora l'errore)
  try {
    await program.methods
      .initialize()
      .accounts({
        state,
        admin: wallet.publicKey,
        tokenMint: MINT,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("✔ initialize");
  } catch (e:any) {
    console.log("ℹ initialize skipped (probably already initialized):", e.message ?? e);
  }

  // 3) configure_presale (fase 0): imposta treasury + rate + cap
  // Esempio: 1 SOL = 1,000,000 TORT (ui), se il mint ha 9 decimals => per-lamport = 1,000,000
  const RATE_PER_LAMPORT = BigInt(process.env.RATE_PER_LAMPORT ?? "1000000"); // adattalo se vuoi
  const CAP_BASE_UNITS   = BigInt(process.env.CAP_BASE_UNITS   ?? (50_000_000n * 10n**9n)); // es. 50M TORT con 9 dec

  await program.methods
    .configurePresale(TREASURY, new anchor.BN(RATE_PER_LAMPORT), new anchor.BN(CAP_BASE_UNITS))
    .accounts({ state, admin: wallet.publicKey })
    .rpc();
  console.log("✔ configure_presale(treasury, rate, cap)");

  // 4) crea l’ATA del vault (authority = PDA)
  const [vaultAuth] = PublicKey.findProgramAddressSync(
    [SEED_PRESALE_VAULT_AUTH_V1, state.toBuffer()],
    PROGRAM_ID
  );
  const ataProgram = await import("@solana/spl-token");
  const vaultAta = await ataProgram.getAssociatedTokenAddress(
    MINT, vaultAuth, true /* allow owner off curve */
  );

  try {
    await program.methods
      .seedPresaleVault()
      .accounts({
        state,
        admin: wallet.publicKey,
        mint: MINT,
        vaultAuth,
        vaultAta,
        tokenProgram: ataProgram.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ataProgram.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("✔ seed_presale_vault (ATA created or already exists)");
  } catch (e:any) {
    console.log("ℹ seed_presale_vault skipped:", e.message ?? e);
  }

  console.log("\nSTATE:", state.toBase58());
  console.log("VAULT_AUTH:", vaultAuth.toBase58());
  console.log("VAULT_ATA:", vaultAta.toBase58());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
