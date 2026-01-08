#!/usr/bin/env bash
set -euo pipefail

# === settings (modifica MINT se diverso) ===
MINT="B6RRamdJmX4QdgUxjL8Y63UkGaM27fPRqExU9Y2EReLs"
TREASURY="8x5jqfcN1iH9reUt1isfidJRV8EpxpTAKPKSuZZPkXVa"   # presale_treasury.json (pubkey)
PRESALE="2gZx6SRaTiy5nXtFK7c6mvGBV1c6esUPCjDcf25E2Vca"   # presale_stock.json (pubkey)

URL="https://api.devnet.solana.com"
echo "→ Using devnet URL: $URL"
solana config set --url "$URL" >/dev/null

# Check tools
command -v spl-token >/dev/null || { echo "Missing spl-token cli"; exit 1; }

echo "→ MINT:     $MINT"
echo "→ TREASURY: $TREASURY"
echo "→ PRESALE:  $PRESALE"

echo "→ Creating ATA (if not exists)…"
spl-token create-account "$MINT" --owner "$TREASURY" || true
spl-token create-account "$MINT" --owner "$PRESALE" || true

TREASURY_ATA=$(spl-token address --token "$MINT" --owner "$TREASURY")
PRESALE_ATA=$(spl-token address --token "$MINT" --owner "$PRESALE")

echo "→ TREASURY_ATA: $TREASURY_ATA"
echo "→ PRESALE_ATA:  $PRESALE_ATA"

echo
echo "== Balances =="
echo "SOL:"
solana balance "$TREASURY" --url "$URL" || true
solana balance "$PRESALE"  --url "$URL" || true

echo
echo "TORT accounts for TREASURY:"
spl-token accounts --owner "$TREASURY" | (cat || true)
echo
echo "TORT accounts for PRESALE:"
spl-token accounts --owner "$PRESALE"  | (cat || true)

echo
echo "Done."
