// frontend/lib/tortState.ts
import { Connection, PublicKey } from "@solana/web3.js";

const SEED_STATE = Buffer.from("state");

function readU8(b: Buffer, o: number){ return [b.readUInt8(o), o+1] as const; }
function readBool(b: Buffer, o: number){ const [v,n]=readU8(b,o); return [v!==0, n] as const; }
function readU64(b: Buffer, o: number){
  let v = 0n; for (let i=0;i<8;i++) v |= BigInt(b[o+i]) << (8n*BigInt(i));
  return [v, o+8] as const;
}
function readI64(b: Buffer, o: number){
  let [u,n] = readU64(b,o);
  if (u & (1n<<63n)) u = -((~u + 1n) & ((1n<<64n)-1n));
  return [u, n] as const;
}
function readPubkey(b: Buffer, o: number){
  return [new PublicKey(b.slice(o,o+32)), o+32] as const;
}

export type Phase = { ratePerLamport: bigint; cap: bigint; sold: bigint; };
export type TortState = {
  admin: PublicKey;
  mint: PublicKey;
  treasury: PublicKey;
  bump: number;
  presaleStart: bigint;
  frozen: boolean;
  totalLamportsRaised: bigint;
  lastMilestone: number;
  currentPhase: number;
  phases: Phase[];
  decimals: number;
};

export async function fetchTortState(
  conn: Connection,
  programId: PublicKey,
  mintPk: PublicKey
): Promise<TortState> {
  const [statePda] = PublicKey.findProgramAddressSync([SEED_STATE], programId);
  const ai = await conn.getAccountInfo(statePda);
  if (!ai) throw new Error("State account non trovato");
  const buf = ai.data as Buffer;

  let o = 8; // skip discriminator
  let admin; [admin,o] = readPubkey(buf,o);
  let mint;  [mint,o]  = readPubkey(buf,o);
  let bump;  [bump,o]  = readU8(buf,o);
  let presaleStart; [presaleStart,o] = readI64(buf,o);
  let frozen; [frozen,o] = readBool(buf,o);
  let totalLamportsRaised; [totalLamportsRaised,o] = readU64(buf,o);
  let lastMilestone; [lastMilestone,o] = readU8(buf,o);
  let treasury; [treasury,o] = readPubkey(buf,o);
  let currentPhase; [currentPhase,o] = readU8(buf,o);

  const phases: Phase[] = [];
  for (let i=0;i<4;i++){
    let rate, cap, sold;
    [rate,o] = readU64(buf,o);
    [cap,o]  = readU64(buf,o);
    [sold,o] = readU64(buf,o);
    phases.push({ ratePerLamport: rate, cap, sold });
  }

  // decimals dal mint (parsed)
  const mintInfo = await conn.getParsedAccountInfo(mintPk);
  const decimals = (mintInfo.value as any)?.data?.parsed?.info?.decimals ?? 5;

  return { admin, mint, treasury, bump, presaleStart, frozen, totalLamportsRaised, lastMilestone, currentPhase, phases, decimals };
}

// UI per 1 SOL (calcolo identico ai tuoi script)
export function uiPerSol(decimals: number, ratePerLamportRaw: bigint): bigint {
  const decPow = 10n ** BigInt(decimals);
  return (ratePerLamportRaw * 1_000_000_000n) / decPow;
}
