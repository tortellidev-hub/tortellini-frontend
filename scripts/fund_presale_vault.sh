#!/usr/bin/env bash
set -euo pipefail

URL=${URL:-https://api.devnet.solana.com}
PROGRAM_ID="EbS2PrDyxBfbEdSQA64jLQTyhCARsDcELr4kUMoG8YK2"
MINT="${MINT:?set MINT}"
OWNER_KEYPAIR="${OWNER_KEYPAIR:-presale_stock.json}"   # keypair che detiene lo stock TORT

STATE_PDA=$(node -e "const {PublicKey}=require('@solana/web3.js');const id=new PublicKey('$PROGRAM_ID');console.log(PublicKey.findProgramAddressSync([Buffer.from('state')], id)[0].toBase58())")
VAULT_AUTH=$(node -e "const {PublicKey}=require('@solana/web3.js');const id=new PublicKey('$PROGRAM_ID');const s=new PublicKey('$STATE_PDA');console.log(PublicKey.findProgramAddressSync([Buffer.from('presale_vault_auth_v1'), s.toBuffer()], id)[0].toBase58())")
VAULT_ATA=$(spl-token address --token "$MINT" --owner "$VAULT_AUTH")

echo "State:      $STATE_PDA"
echo "VaultAuth:  $VAULT_AUTH"
echo "Vault ATA:  $VAULT_ATA"

# crea ATA se mancante (owner = PDA)
spl-token create-account "$MINT" --owner "$VAULT_AUTH" --url "$URL" || true

# trasferisci TORT dallo stock → vault (esempio: 50B UI se DECIMALS=5)
AMOUNT_UI="${AMOUNT_UI:-50000000000}"
spl-token transfer "$MINT" "$AMOUNT_UI" "$VAULT_ATA" \
  --owner "$OWNER_KEYPAIR" \
  --fund-recipient --allow-unfunded-recipient \
  --url "$URL"

spl-token balance "$VAULT_ATA"
