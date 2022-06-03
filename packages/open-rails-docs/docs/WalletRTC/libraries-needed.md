### WalletRTC libraries needed:

Wallet Adapter Bundle: allows desktop website <-> mobile wallet, or mobile website <-> desktop wallet

- On desktop website, present a QR code for a mobile wallet to scan
- On mobile website, open a camera to scan a QR code presented by a desktop wallet
- establishes connection, handles message passing using a window.solana object

Desktop applications (unreal engine 5?): need to connect to mobile wallets. Presents QR code, handles connection, messages.

Desktop wallets: need to connect to mobile sites and mobile apps. Presents QR code.

Mobile Apps: a dapp that wants to talk to a desktop wallet. React Native, Swift, and Kotlin.

A library for kiosks

A library for mobile app wallets

[^1]: Note that, for our purposes here, it doesn't matter if the tx-construction and tx-verification are done in the user's browser (self-sufficient client), or done on a remote server (relay client), because the user-interface is the same. Another dapp use-case not considered here is headless servers, such as a remote linux server that you communicate with via command line. Usually in these cases you have a CLI-tool that stores your private key and produces signatures using it.
