---
title: Dapp <-> Wallet Communication - Intro
description: background on how wallets communicate with dapps
slug: /wallet-dapp-communication
sidebar_position: 1
---

How do we get crypto wallets and dapps (distributed applications) to communicate?

Wallet programs run in the following environments:

- As a browser extension on desktop (Phantom, MetaMask)
- As an loadable iframe inside a desktop or mobile browser (Torus)
- As a native mobile-app on iOS or Android (Phantom, MetaMask)
- As a native desktop program (Exodus, Frame)

Wallets store the user's private-key (or shares of the key) in a number of locations:

- In the user-device's filesystem (usually encrypted) (Phantom)
- In the web-browser's local storage (Fractal wallet, NEAR default wallet)
- On remote servers (iCloud backup, Torus network)
- On a dedicated physical device (Trezor, Ledger)

Dapps run in the following environments:

- In the user's web-browser (desktop and mobile)
- In a native mobile-app (MagicEden, OpenSea)
- In a native desktop program (crypto-enabled games such as Yakuverse or Enviro)
- In a secure remote server
- In a secure physical device (point-of-sale kiosk)

There is no single communication method that is 'the best' for every situation. All wallet <-> dapp communication methods can be broken down into one of three categories: provider injection, network messaging, and redirect flows.

## Provider Injection:

The wallet injects a javascript object directly into the global environment of the app the user is viewing, usually via a `window.solana` object. Each wallet exposes it's own idiosyncratic list of properties and methods. For example, Phantom has `window.solana.request()` and `window.solana.connect()` (see the [Phantom documentation](https://docs.phantom.app/integrating/detecting-the-provider) for more details). However, web-app developers should not concern themselves with anything wallet-specific, and should instead use a wallet adapter-libraries and reference the Wallet Adapter API. This will allow for future extensibility and maximize compatability with a variety of wallets, even wallets which haven't been built yet.

There are several ways in which wallets accomplish this provider-injection:

- **Browser Extension:** [Phantom](https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?hl=en) and [Sollet](https://chrome.google.com/webstore/detail/sollet/fhmfendgdocmcbmfikdcogofphimnkno?hl=en) are browser-extensions that the user installs. Browser extensions can read and modify pages, allowing them to insert their javascript provider into your web-app as soon as it loads. The user's private key and seed-phrase is encrypted and stored on the user's machine (this is called a non-custodial wallet).

- **Web Wallet Popup:** When [Solflare's](https://solflare.com/) [wallet-adapter](https://github.com/solana-labs/wallet-adapter/tree/master/packages/wallets/solflare) is added to your web-app, it will also include its [own SDK](https://github.com/solflare-wallet/solflare-sdk) in the bundle. When users select solflare as their wallet, the Solflare SDK will create a new pop-up window and authenticate the user. Whenever your web-app makes a request to the Solflare library, the Solflare library will make a request to the code running within that pop-up window, which will make authenticated requests to Solflare's servers, where the user's private key is stored (this is called a custodial wallet), allowing Solflare to sign and transmit transactions. The downside of this method is that if the user closes the solflare pop-up window, the wallet will disconnect. Additionally, because it's a custodial service, if Solflare were hacked its user's private keys could be compromised.

- **Web Wallet iFrame:** an even more clever solution is [Torus](https://toruswallet.io/). When the user selects Torus as their wallet, Torus will embed a hidden iframe into your webpage and authenticate the user in a temporary popup window. Whenever your web-app makes a request to Torus, it will communicate with this hidden iframe, the same as if it were a browser extension. The Torus iframe stores the user's private key in memory and uses it to sign and transmit transactions. (Interestingly enough, Torus does not have custody of your private key--instead it is reconstructed on the fly from 5 of 9 shares stored on a decentralized network of key-providers using [Shamir's Secret Sharing algorithm](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing).)

## Network Messaging:

Network messaging are standards that send data packets between the dapp and the wallet over a network.

- **Wallet Connect 1.0:** A 'bridge' server sits between the dapp and the wallet, establishing websocket connections to both of them and relaying end-to-end encrypted messages between them. It also standardizes JSON-RPC API methods, but only for Ethereum and other EVM-chains. The disadvantage of this is that it requires a websocket server at all times, which introduces a socket.

- **Wallet Connect 2.0:** A complete rewrite of 1.0 designed to support non-EVM chains and multiple chains at the same time. It adds JSON-RPC API Methods for Cosmos, Polkadot, Stellar, and Solana. However, these are heavily incomplete at the time of writing (June 2022). It also adds decentralized messaging using Waku / libp2p (an ipfs library), although dapp <-> wallet communication will still require a websocket server.

- **Solana Pay:** The original Solana Pay encodes simple SPL-token transfers as URLs, which wallets parse and construct into a full transaction. The new Solana Pay transaction-request spec has wallets parse URLs, which they make an HTTP POST request to and receive a transaction in response. The problem with this, compared to wallet-connect, is that (1) it does not establish a bi-directional communication channel between the wallet and a server, it is only a single request and a response, limiting appplications, (2) dapps now require a back-end server to serve up their transactions for them because there is no URL to reach a dapp running in a client-browser, and (3) a new QR code or deep-link must be presented for each transaction or signature request.

## Redirect Flow:

Sometimes the dapp and the wallet programs are running on the same physical device, but they cannot easily communicate with each other due to sandboxing and operating-system limitations. For example:

- **Dapp in a mobile browser <-> Wallet in a native mobilea-app:** browser extensions are only just starting to emerge on mobile web browsers (mobile-Safari recently added browser-extension support with iOS 15). Furthermore, pop-up windows cannot communicate with each other on mobile using `window.posMessage()` like they can on desktop, meaning Web Wallet Popups will not work either. Currently (June 2022) Phantom and MetaMask's mobile apps get around the mobile-browser-dapp <-> native-mobile-wallet communication by having a web-browser built directly into their native app.

- **Wallets running as desktop applications:** the dapp is running in a web-browser, but it cannot easily communicate with a native desktop app.

In these cases, where redirect flows can be useful. See [Phantom's Redirect docs](https://docs.phantom.app/integrating/deeplinks) for examples; the web-app can create urls like these:

-

- **Web Wallets:** NEAR default -

- **Wallet Connect:** -

Suppose you have app.uniswap running in your mobile web-browser. You click on 'connect wallet' and then 'wallet connect'. This will present you with a list of wallets to select. You pick MetaMask, and then you'll get sent to a URL like this:

`https://metamask.app.link/wc?uri=wc%3Ab3c6e953-ffe3-4995-b855-c5836e030bf0%401%3Fbridge%3Dhttps%253A%252F%252Fl.bridge.walletconnect.org%26key%3Db8e8483e9f89589a1c1dd72c8d2ebb7e3f080b9cc0392a960970f9f30218f315`

This is a deep-link into metamask, which iOS will open with your MetaMask wallet (if it's installed) or redirect you to metamask's website (if it's not installed). Now inside of MetaMask, the user can confirm a connection, sign a message, a transaction, etc., and then be redirected back into the original web-browser, passing the results to Uniswap as a URL query param. (In this case, I don't know if they're communicating with a bridge server or with a redirect.) The dapp and wallet can then bounce between each other in this way.

As of writing (June 2022), Solana has no standardized redirect flow for wallets. [Solana Pay](https://github.com/solana-labs/solana-pay) and Phantom Deeplinking are the first attempts to standardize redirect flows.
