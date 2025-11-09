# 🔐 DOKCHAIN — Built on Solana

> A tamper-proof, decentralized document storage & verification platform for individuals and institutions — powered by **Solana**, **Anchor**, and **Arweave/IPFS**.

![Solana](https://img.shields.io/badge/Solana-Rust%20|%20Anchor-blueviolet?logo=solana)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Build-Building-yellow)

---

## 🌍 Overview

**DOKCHAIN** lets users **store**, **verify**, and **share** important digital documents (certificates, degrees, IDs) in a **self-sovereign**, **cryptographically verifiable**, and **tamper-proof** way.  
Verified institutions issue credentials, users control them, and verifiers can trust them — all without centralized intermediaries.

---

## ✨ Features

### 🧍 For Users
- 🔑 Connect via Solana wallet (Phantom, Solflare, Backpack)
- 📄 Upload and encrypt documents before uploading
- 🔗 Document hashes and metadata anchored on-chain
- 🤝 Share access with others securely
- ❌ Revoke or update documents anytime

### 🏫 For Institutions
- 🧾 Register as an issuer and get verified on-chain
- 🪪 Issue verifiable credentials to wallet addresses
- 🧩 Manage issued certificates and view issuance logs

### 🔍 For Verifiers
- 🧮 Verify a document’s authenticity using its CID/hash
- ✅ Validate issuer identity, hash, and timestamp on-chain
- 📱 Verify through QR codes for printed credentials

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Blockchain | Solana (Rust + Anchor) |
| Frontend | React + TailwindCSS + shadcn/ui |
| Wallet Integration | Solana Wallet Adapter |
| Storage | Arweave / IPFS (via Bundlr) |
| Encryption | AES-GCM + asymmetric key sharing |
| Deployment | Vercel / Netlify (frontend) + Solana Devnet (program) |

---

## 🧱 Folder Structure

```bash
.
├── app-frontend/
│   ├── components/
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Verify.tsx
│   │   ├── Issue.tsx
│   │   └── Profile.tsx
│   ├── hooks/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── solana-program/
│   ├── programs/
│   │   └── digilocker/
│   │       ├── src/
│   │       │   └── lib.rs
│   │       └── Cargo.toml
│   ├── Anchor.toml
│   └── migrations/
│
├── README.md
└── .gitignore

🧑‍💻 Getting Started
1️⃣ Clone the Repository

git clone https://github.com/<your-username>/decentralized-digilocker.git
cd decentralized-digilocker

2️⃣ Install Dependencies
Frontend

cd app-frontend
npm install

Solana Program

cd solana-program
anchor build

3️⃣ Run the Frontend (Development)

cd app-frontend
npm run dev

Then open 👉 http://localhost:5173
4️⃣ Deploy the Solana Program (Optional)

cd solana-program
anchor deploy

🧰 Useful Commands
Command	Description
npm run dev	Start frontend dev server
npm run build	Build frontend for production
npm run lint	Lint frontend code
npm run format	Format frontend code
anchor build	Build Solana smart contracts
anchor test	Run Solana program tests
anchor deploy	Deploy program to Devnet
anchor clean	Remove build artifacts
🧠 Example Solana Instruction (Anchor)

#[derive(Accounts)]
#[instruction(doc_hash: [u8; 32])]
pub struct CreateDocument<'info> {
    #[account(
        init,
        payer = user,
        space = Document::LEN,
        seeds = [b"document", user.key().as_ref(), doc_hash.as_ref()],
        bump
    )]
    pub document: Account<'info, Document>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn create_document(
    ctx: Context<CreateDocument>,
    doc_hash: [u8; 32],
    cid: String,
) -> Result<()> {
    let document = &mut ctx.accounts.document;
    document.owner = ctx.accounts.user.key();
    document.doc_hash = doc_hash;
    document.cid = cid;
    document.timestamp = Clock::get()?.unix_timestamp;
    Ok(())
}

🔐 Security Principles

    ✅ Client-side encryption (no plaintext files on-chain)

    🧩 PDAs for deterministic, program-owned accounts

    🔒 On-chain immutability for all metadata

    🔎 Auditability and open verification logic

🚀 Roadmap

DAO-based issuer verification

DID (did:sol) integration

QR-code verification system

Zero-Knowledge proofs for private credential verification

    Cross-chain credential interoperability

🧾 License

MIT License © 2025 [Your Name / Organization]
Free for personal and commercial use with attribution.
🤝 Contributing

We welcome contributions!

    Fork this repo

    Create a new branch (git checkout -b feature/new-feature)

    Commit your changes (git commit -m "Add new feature")

    Push your branch (git push origin feature/new-feature)

    Open a Pull Request 🚀

🌐 Community

    💬 Discord: coming soon