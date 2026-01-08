// utils/presaleState.ts
import { Connection, PublicKey } from '@solana/web3.js';

const LAMPORTS_PER_SOL = 1_000_000_000n;
const SEED_STATE = Buffer.from('state');
const SEED_VAULT_AUTH = Buffer.from('presale_vault_auth_v1');

function u64le(buf: Buffer, o: number): [bigint, number] {
  let v = 0n;
  for (let i = 0; i < 8; i++) v |= BigInt(buf[o + i]) << (8n * BigInt(i));
  return [v, o + 8];
}
function i64le(buf: Buffer, o: number): [bigint, number] {
  let [u, n] = u64le(buf, o);
  if (u & (1n << 63n)) u = -((~u + 1n) & ((1n << 64n) - 1n));
  return [u, n];
}
function u8(buf: Buffer, o: number): [number, number] { return [buf.readUInt8(o), o + 1]; }
function bool(buf: Buffer, o: number): [boolean, number] { const [v, n] = u8(buf, o); return [v !== 0, n]; }
function pubkey(buf: Buffer, o: number): [PublicKey, number] {
  return [new PublicKey(buf.subarray(o, o + 32)), o + 32];
}

export type Phase = { ratePerLamport: bigint; cap: bigint; sold: bigint };
export type StateDecoded = {
  admin: PublicKey;
  mint: PublicKey;
  treasury: PublicKey;
  presaleStart: bigint;
  frozen: boolean;
  totalLamportsRaised: bigint;
  lastMilestone: number;
  currentPhase: number;
  phases: Phase[]; // length 4
  statePda: PublicKey;
  vaultAuth: PublicKey;
  vaultAta: PublicKey; // calcolabile lato UI se serve
};

export async function fetchPresaleState(connection: Connection, programId: PublicKey, mint: PublicKey): Promise<StateDecoded> {
  const [statePda] = PublicKey.findProgramAddressSync([SEED_STATE], programId);
  const ai = await connection.getAccountInfo(statePda);
  if (!ai) throw new Error('State account not found');
  const buf = Buffer.from(ai.data);
  let o = 8; // skip discriminator

  let admin; [admin, o] = pubkey(buf, o);
  let mintPk; [mintPk, o] = pubkey(buf, o);
  let _bump; [/* bump_state */ , o] = u8(buf, o);
  let presaleStart; [presaleStart, o] = i64le(buf, o);
  let frozen; [frozen, o] = bool(buf, o);
  let totalLamportsRaised; [totalLamportsRaised, o] = u64le(buf, o);
  let lastMilestone; [lastMilestone, o] = u8(buf, o);
  let treasury; [treasury, o] = pubkey(buf, o);
  let currentPhase; [currentPhase, o] = u8(buf, o);

  const phases: Phase[] = [];
  for (let i = 0; i < 4; i++) {
    let rate, cap, sold;
    [rate, o] = u64le(buf, o);
    [cap, o] = u64le(buf, o);
    [sold, o] = u64le(buf, o);
    phases.push({ ratePerLamport: rate, cap, sold });
  }

  const [vaultAuth] = PublicKey.findProgramAddressSync([SEED_VAULT_AUTH, statePda.toBuffer()], programId);
  // L’ATA del vault si può derivare con @solana/spl-token se serve mostrarlo anche lato UI.

  return { admin, mint: mintPk, treasury, presaleStart, frozen, totalLamportsRaised, lastMilestone, currentPhase, phases, statePda, vaultAuth, vaultAta: PublicKey.default };
}

export function uiPerSOLFromRate(ratePerLamportRaw: bigint, decimals: number): bigint {
  const decPow = 10n ** BigInt(decimals);
  return (ratePerLamportRaw * LAMPORTS_PER_SOL) / decPow; // UI per 1 SOL
}
export function uiFromRaw(raw: bigint, decimals: number): string {
  const decPow = 10n ** BigInt(decimals);
  const int = raw / decPow;
  const frac = raw % decPow;
  const s = frac.toString().padStart(decimals, '0').replace(/0+$/,'');
  return s ? `${int}.${s}` : `${int}`;
}
