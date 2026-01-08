// lib/buyPresale.ts
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";

const SEED_STATE = Buffer.from("state");
const SEED_PRESALE_VAULT_AUTH_V1 = Buffer.from("presale_vault_auth_v1");

// sighash("global", name)
function sighashGlobal(name: string): Buffer {
  const enc = new TextEncoder();
  const pre = enc.encode(`global:${name}`);
  // Mini sha256: usa Web Crypto API per il browser
  // In Next lato client, conviene precomputare fuori (qui per semplicità):
  // In alternativa, importa un tiny sha256. Per dev va bene così:
  // @ts-ignore
  const cryptoObj: Crypto = globalThis.crypto || (window as any).crypto;
  throwIf(!cryptoObj?.subtle, "WebCrypto non disponibile (https)");
  // NOTA: per semplicità, in dev puoi importare 'crypto-js/sha256' e prendere i primi 8 byte.
  // Qui lasciamo il placeholder minimal:
  throw new Error("Implementare sha256('global:name') → 8 bytes (riuso dello script server side è la via più rapida).");
}

function throwIf(c: any, m: string){ if(c) throw new Error(m); }

export async function buildBuyIx(
  conn: Connection,
  programId: PublicKey,
  mint: PublicKey,
  buyer: PublicKey,
): Promise<{ ix: TransactionInstruction; userAta: PublicKey; vaultAta: PublicKey; }> {

  const [state] = PublicKey.findProgramAddressSync([SEED_STATE], programId);
  const [vaultAuth] = PublicKey.findProgramAddressSync([SEED_PRESALE_VAULT_AUTH_V1, state.toBuffer()], programId);

  const userAta = getAssociatedTokenAddressSync(mint, buyer, false);
  const vaultAta = getAssociatedTokenAddressSync(mint, vaultAuth, true);

  // ⚠️ Ordine degli accounts identico al tuo scripts/buy_presale.ts!
  const keys = [
    { pubkey: state,                     isWritable: true,  isSigner: false },
    { pubkey: buyer,                     isWritable: true,  isSigner: true  },
    { pubkey: mint,                      isWritable: false, isSigner: false },
    { pubkey: userAta,                   isWritable: true,  isSigner: false },
    { pubkey: vaultAuth,                 isWritable: false, isSigner: false },
    { pubkey: vaultAta,                  isWritable: true,  isSigner: false },
    { pubkey: TOKEN_PROGRAM_ID,          isWritable: false, isSigner: false },
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,isWritable:false, isSigner: false },
    { pubkey: SystemProgram.programId,   isWritable: false, isSigner: false },
    new PublicKey(process.env.NEXT_PUBLIC_TORT_TREASURY!) // se nel tuo script è in lista, inseriscila come {pubkey: X, isWritable:true/false, isSigner:false}
  ].map(k => (k instanceof PublicKey ? { pubkey: k, isWritable:false, isSigner:false } : k));

  const data = /** 8 bytes sighash */ new Uint8Array(8); // ← sostituisci con il risultato di sighashGlobal("buy_presale")
  return { ix: new TransactionInstruction({ programId, keys: keys as any, data }), userAta, vaultAta };
}

export async function sendBuy(
  conn: Connection,
  programId: PublicKey,
  mint: PublicKey,
  wallet: { publicKey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction>; },
  lamports: number
){
  const { ix } = await buildBuyIx(conn, programId, mint, wallet.publicKey);
  // Attacca i lamports nel tx come fee payer e paga tramite l’istruzione del programma (come già fa il tuo script)
  const tx = new Transaction().add(ix);
  tx.feePayer = wallet.publicKey;
  tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
  // Il valore in lamports lo definisci al momento dell’invio (solitamente l’istruzione del programma fa il trasferimento interno)
  // Se nel tuo script non c’è un transfer extra, non aggiungerlo qui.
  const signed = await wallet.signTransaction(tx);
  const sig = await conn.sendRawTransaction(signed.serialize(), { skipPreflight:false });
  return sig;
}
