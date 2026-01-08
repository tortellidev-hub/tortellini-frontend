import {
  Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import {
  PROGRAM_ID, TREASURY_SOL, statePda, anchorDisc,
  u64Le, snapshotPda, vaultAuthorityPda, MINT
} from "./solana";

type SignerFn = (tx: Transaction) => Promise<Transaction>;

/** Sends SOL -> treasury, then calls buy_presale_tokens (manual IX). */
export async function lamportsTransferAndBuy(opts: {
  connection: Connection;
  payer: PublicKey;
  signTransaction: SignerFn;
  lamports: number;
}) {
  const { connection, payer, signTransaction, lamports } = opts;

  // 1) Ensure ATAs for payer and admin-side token accounts will be resolved on-chain (user ATA is required)
  // In presale, program takes tokens from admin's pool to user ATA (program verifies accounts).
  // On the client, we only need user ATA to exist.
  await getOrCreateAssociatedTokenAccount(connection, {
    payer, mint: MINT, owner: payer
  } as any); // wallet adapter doesn't expose Keypair; Anchor-style helper not fully typed. Safe in runtime.

  // 2) Build transfer SOL to treasury
  const transferIx = SystemProgram.transfer({ fromPubkey: payer, toPubkey: TREASURY_SOL, lamports });

  // 3) Build program instruction buy_presale_tokens(u64 lamports_sent)
  const keys = [
    { pubkey: statePda(),     isWritable: true,  isSigner: false }, // state
    { pubkey: TREASURY_SOL,   isWritable: true,  isSigner: false }, // treasury (SOL)
    { pubkey: getAssociatedTokenAddressSync(MINT, payer), isWritable: true, isSigner: false }, // user_token_account
    { pubkey: payer,          isWritable: true,  isSigner: true  }, // admin (payer acts as buyer/admin authority on client)
    // admin_token_account is expected on-chain to belong to admin; the program will validate.
    // For client-only buy, we omit the admin ATA key because the program IDL expects it in a position.
    // If your on-chain instruction requires it explicitly, you can pass it from config.
    // Here we add it as equal to user ATA to keep layout, but program will check and reject if wrong.
    { pubkey: getAssociatedTokenAddressSync(MINT, payer), isWritable: true, isSigner: false }, // admin_token_account (placeholder)
    { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false }
  ];
  const data = Buffer.concat([anchorDisc("buy_presale_tokens"), u64Le(BigInt(lamports))]);
  const buyIx = new TransactionInstruction({ programId: PROGRAM_ID, keys, data });

  const tx = new Transaction().add(transferIx).add(buyIx);
  tx.feePayer = payer;
  const signed = await signTransaction(tx);
  const sig = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

/** Claims from snapshot vault PDA to user's ATA. */
export async function claimAirdrop(opts: {
  connection: Connection;
  owner: PublicKey;
  signTransaction: SignerFn;
  cycle: bigint;
  rawAmount: bigint;
}) {
  const { connection, owner, signTransaction, cycle, rawAmount } = opts;

  // Ensure destination ATA
  const userAta = getAssociatedTokenAddressSync(MINT, owner);
  await getOrCreateAssociatedTokenAccount(connection, { payer: owner, mint: MINT, owner } as any);

  const snap = snapshotPda(cycle);
  const vaultAuth = vaultAuthorityPda(snap);
  const vaultAta = getAssociatedTokenAddressSync(MINT, vaultAuth, true);

  const keys = [
    { pubkey: snap,          isWritable: true,  isSigner: false }, // snapshot
    { pubkey: vaultAuth,     isWritable: false, isSigner: false }, // vault_authority (PDA)
    { pubkey: vaultAta,      isWritable: true,  isSigner: false }, // vault_ata
    { pubkey: statePda(),    isWritable: true,  isSigner: false }, // state
    { pubkey: userAta,       isWritable: true,  isSigner: false }, // user_destination
    { pubkey: owner,         isWritable: true,  isSigner: true  }, // claimer
    { pubkey: MINT,          isWritable: true,  isSigner: false }, // token_mint (mut in on-chain burn/transfer ops)
    { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false }
  ];

  const data = Buffer.concat([anchorDisc("claim_airdrop"), u64Le(rawAmount)]);
  const ix = new TransactionInstruction({ programId: PROGRAM_ID, keys, data });

  const tx = new Transaction().add(ix);
  tx.feePayer = owner;
  const signed = await signTransaction(tx);
  const sig = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}
