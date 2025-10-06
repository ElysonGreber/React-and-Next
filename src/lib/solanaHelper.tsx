import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey("3tSAgQ3iu5WDo1FsEUg6gQTY8QB17z5SjhVAZasmxyLz");
export const CREDIT_WALLET = new PublicKey("DEr8Y8GG19SSXHBDMcFVvxwrcZxFcihsm3CrQZtkrkbH");
export const connection = new Connection("https://api.devnet.solana.com", "finalized");
export const DATA_SIZE = 8 + 1 + 1 + 200 * 3;

export async function getPda(publicKey: PublicKey) {
  const [pda] = await PublicKey.findProgramAddressSync(
    [Buffer.from("score"), publicKey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

// 🔹 Alterado: recebe callback opcional onStage
export async function sendInstruction(
  wallet: any,
  instructionData: number,
  onStage?: (stage: string) => void
) {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  try {
    if (onStage) onStage("🔄 Preparando PDA...");
    const pda = await getPda(wallet.publicKey);

    const keys = [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: pda, isSigner: false, isWritable: true },
      { pubkey: CREDIT_WALLET, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    ];

    if (onStage) onStage("📡 Criando instrução...");
    const ix = new TransactionInstruction({ programId: PROGRAM_ID, keys, data: Buffer.from([instructionData]) });

    const tx = new Transaction().add(ix);
    tx.feePayer = wallet.publicKey;

    if (onStage) onStage("📄 Solicitando último blockhash...");
    const latestBlockhash = await connection.getLatestBlockhash("finalized");
    tx.recentBlockhash = latestBlockhash.blockhash;

    if (onStage) onStage("✍️ Assinando transação...");
    const signedTx = await wallet.signTransaction(tx);

    if (onStage) onStage("🚀 Enviando transação...");
    const sig = await connection.sendRawTransaction(signedTx.serialize());

    if (onStage) onStage(`⏳ Confirmando transação: ${sig}...`);
    await connection.confirmTransaction(sig, "finalized");

    const txDetails = await connection.getParsedTransaction(sig, { commitment: "finalized" });
    const logs = txDetails?.meta?.logMessages || [];

    if (onStage) onStage(`✅ Transação confirmada: ${sig}`);

    return { signature: sig, logs };
  } catch (err) {
    if (onStage) onStage("❌ Erro ao enviar transação");
    throw err;
  }
}

export async function readPda(publicKey: PublicKey) {
  const pda = await getPda(publicKey);
  const accountInfo = await connection.getAccountInfo(pda);
  if (!accountInfo) throw new Error("PDA not found");

  const data = accountInfo.data;
  const score = Number(data.readBigUInt64LE(0));
  const history_len = data[8];
  const credits = data[9];

  const history: { player: number; program: number; result: number }[] = [];
  for (let i = 0; i < history_len; i++) {
    const offset = 10 + i * 3;
    history.push({ player: data[offset], program: data[offset + 1], result: data[offset + 2] });
  }

  return { score, history_len, credits, history };
}
