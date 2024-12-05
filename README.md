# Web Wallet (junkcoin-web-wallet)
This repository contains the codebase for the official Junkcoin web wallet. The web wallet allows users to securely store, send, and receive Junkcoin ($JKC) directly from their browsers.

## Features
- Generate new wallets (mnemonic-based or private key import).
- Send and receive Junkcoin transactions.
- Display wallet balances and transaction history.
- Integrated QR code support for addresses.
- Cross-platform compatibility (mobile and desktop browsers).

## Development Information
- **Branches**:
  - `main`: Stable releases.
  - `dev`: Active development and feature implementation.

- **Technologies**:
  - Frontend: React (or another lightweight JS framework).
  - Backend (optional): Node.js for APIs (if needed for extended features like transaction broadcasting).

## Getting Started

### Prerequisites
- Node.js (>=16.x)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/JunkcoinFoundation/junkcoin-web-wallet.git
cd junkcoin-web-wallet
npm install
```
## Running the Wallet
Start the wallet locally:
```bash
npm run start
```
Access the wallet at http://localhost:3000.

## Contribution
We welcome contributions! To get started:
1. Fork this repository.
2. Work on your changes in a branch derived from `dev`.
3. Open a pull request once ready.

## License
This project is licensed under the MIT License.
