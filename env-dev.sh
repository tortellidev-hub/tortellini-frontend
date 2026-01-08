# RPC + wallet
export ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"
export ANCHOR_WALLET="$HOME/.config/solana/id.json"

# Programma e conti principali
export PROGRAM_ID="GhkrgU47GmoNwr4ufpASzNb9aGZSyq6hA3jJrhM81zi5"
export MINT="B6RRamdJmX4QdgUxjL8Y63UkGaM27fPRqExU9Y2EReLs"
export TREASURY="8x5jqfcN1iH9reUt1isfidJRV8EpxpTAKPKSuZZPkXVa"

# (consigliato) la tua PDA principale: mettila quando la conosci
# export PRESALE_PDA="<indirizzo presale/state>"

# (opzionali, solo se te li chiede lo script/metodo)
# export ACCOUNT_VAULT="..."
# export ACCOUNT_FEE="..."
# export STATE_SEED="presale"   # solo se proprio vuoi forzare il seed (non serve se usi PRESALE_PDA)

alias phase0='npx ts-node --compiler-options '\''{"module":"CommonJS"}'\'' scripts/set_phase_params.ts 0'
alias phase1='npx ts-node --compiler-options '\''{"module":"CommonJS"}'\'' scripts/set_phase_params.ts 1'
alias phase2='npx ts-node --compiler-options '\''{"module":"CommonJS"}'\'' scripts/set_phase_params.ts 2'
alias phase3='npx ts-node --compiler-options '\''{"module":"CommonJS"}'\'' scripts/set_phase_params.ts 3'



