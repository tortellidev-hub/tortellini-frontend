// frontend/src/lib/anchorProgram.ts
"use client";

import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

/**
 * IDL locale del programma TORTELLINI.
 * Derivato da tortellini.json che mi hai incollato.
 */
const TORTELLINI_IDL: anchor.Idl = {
  version: "0.1.0",
  name: "tortellini",
  metadata: {
    name: "tortellini",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "buy_presale",
      discriminator: [113, 18, 193, 68, 35, 36, 215, 8],
      accounts: [
        { name: "state", writable: true },
        { name: "buyer", writable: true, signer: true },
        { name: "buyer_ata", writable: true },
        { name: "mint", writable: true },
        {
          name: "mint_authority",
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 105, 110, 116, 95, 97, 117, 116, 104], // "mint_auth"
              },
            ],
          },
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "claim_user_tokens",
      discriminator: [47, 29, 5, 159, 176, 136, 15, 112],
      accounts: [
        { name: "state", writable: true },
        { name: "from", writable: true },
        { name: "to", writable: true },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "distribute_reward",
      discriminator: [135, 65, 136, 143, 108, 234, 198, 46],
      accounts: [
        { name: "state", writable: true },
        { name: "admin", writable: true, signer: true },
        { name: "from", writable: true },
        { name: "to", writable: true },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 97, 116, 101], // "state"
              },
            ],
          },
        },
        { name: "admin", writable: true, signer: true },
        { name: "token_mint" },
        { name: "airdrop_source", writable: true },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "rent",
          address: "SysvarRent111111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "release_airdrop",
      discriminator: [99, 162, 135, 63, 69, 84, 192, 80],
      accounts: [
        { name: "state", writable: true },
        { name: "admin", writable: true, signer: true },
        { name: "from", writable: true },
        { name: "to", writable: true },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "State",
      discriminator: [216, 146, 107, 94, 104, 75, 182, 177],
    },
  ],
  errors: [
    { code: 6000, name: "PresaleEnded", msg: "Presale has ended" },
    { code: 6001, name: "AllMilestonesCompleted", msg: "All airdrop milestones completed" },
    { code: 6002, name: "Unauthorized", msg: "Unauthorized" },
    { code: 6003, name: "TooSoon", msg: "Too soon for new milestone" },
    { code: 6004, name: "ClaimExpired", msg: "Claim period expired" },
  ],
  types: [
    {
      name: "State",
      type: {
        kind: "struct",
        fields: [
          { name: "admin", type: "pubkey" },
          { name: "token_mint", type: "pubkey" },
          { name: "presale_start_ts", type: "i64" },
          { name: "total_presale_distributed", type: "u64" },
          { name: "total_airdrop_distributed", type: "u64" },
          { name: "airdrop_reserve", type: "u64" },
          { name: "airdrop_milestone", type: "u8" },
          { name: "last_airdrop_ts", type: "i64" },
        ],
      },
    },
  ],
};

// 👇 Program ID preso dall'IDL ("address")
const PROGRAM_ID = new PublicKey("3Y1JeL7g6gj5VY3ThkyThDhYosWUryvCveLvA51NTHZg");

/**
 * Hook React per ottenere l'oggetto Program di Anchor.
 * Usa l'IDL locale e il Program ID hardcodato.
 */
export function useProgram(provider?: anchor.AnchorProvider | null) {
  return useMemo(() => {
    if (!provider) return null;
    try {
      const p = new anchor.Program(TORTELLINI_IDL, PROGRAM_ID, provider as any);
      return p;
    } catch (e) {
      console.error("useProgram: failed to create Program instance:", e);
      return null;
    }
  }, [provider]);
}
