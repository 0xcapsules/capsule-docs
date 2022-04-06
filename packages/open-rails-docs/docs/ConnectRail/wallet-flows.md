---
title: Wallet <-> Dapp Communication - Introduction
description: a context on how wallets communicate with dapps
slug: /wallet-dapp-communication
sidebar_position: 1
---

How do we get crypto wallets and dapps (distributed applications) to communicate?

Wallets run on the following devices:

- Inside of a web-browser extension (Phantom, MetaMask)
- As a desktop program (Exodus)
- As a web-service (Solflare, Torus)
- As a mobile-app (Phantom, MetaMask)
- On a dedicated physical device (Trezor, Ledger)

Dapps run on the following devices:

- In the user's web-browser (desktop and mobile)
- In a dedicated mobile-app (MagicEden, OpenSea)
- On a remote server
- On a dedicated physical device (point-of-sale kiosk, Xbox)

There is no single communication method that is 'the best' for every situation. All wallet <-> dapp communication methods can be broken down into one of three categories: provider injection, messaging, and redirect flows.

## Provider Injection:

The wallet injects a javascript object directly into the web-app the user is viewing, usually via a `window.solana` object. Each wallet exposes it's own idiosyncratic list of properties and methods. For example, Phantom has `window.solana.request()` and `window.solana.connect()` (see the [Phantom documentation](https://docs.phantom.app/integrating/detecting-the-provider) for more details). However, web-app developers should not concern themselves with anything wallet-specific, and should instead use adapter-libraries and reference the common standard api. This will allow for future extensibility and maximize compatability with a variety of wallets, many of which have not even been built yet.

There are several ways in which wallets accomplish this provider-injection:

- **Browser Extension:** [Phantom](https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?hl=en) and [Sollet](https://chrome.google.com/webstore/detail/sollet/fhmfendgdocmcbmfikdcogofphimnkno?hl=en) are browser-extensions that the user installs. Browser extensions can read and modify pages, allowing them to insert their javascript provider into your web-app as soon as it loads. The user's private key and seed-phrase is encrypted and stored on the user's machine (this is called a non-custodial wallet).

- **Web Wallet Popup:** When [Solflare's](https://solflare.com/) [wallet-adapter](https://github.com/solana-labs/wallet-adapter/tree/master/packages/wallets/solflare) is added to your web-app, it will also include its [own SDK](https://github.com/solflare-wallet/solflare-sdk) in the bundle. When users select solflare as their wallet, the Solflare SDK will create a new pop-up window and authenticate the user. Whenever your web-app makes a request to the Solflare library, the Solflare library will make a request to the code running within that pop-up window, which will make authenticated requests to Solflare's servers, where the user's private key is stored (this is called a custodial wallet), allowing Solflare to sign and transmit transactions. The downside of this method is that if the user closes the solflare pop-up window, the wallet will disconnect. Additionally, because it's a custodial service, if Solflare were hacked its user's private keys could be compromised.

- **Web Wallet iFrame:** an even more clever solution is [Torus](https://toruswallet.io/). When the user selects Torus as their wallet, Torus will embed a hidden iframe into your webpage and authenticate the user in a temporary popup window. Whenever your web-app makes a request to Torus, it will communicate with this hidden iframe, the same as if it were a browser extension. The Torus iframe stores the user's private key in memory and uses it to sign and transmit transactions. (Interestingly enough, Torus does not have custody of your private key--instead it is reconstructed on the fly from 5 of 9 shares stored on a decentralized network of key-providers using [Shamir's Secret Sharing algorithm](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing).)

## Messaging:

- Wallet Connect 1.0

- Wallet Connect 2.0

- Solana Pay: -

## Redirect Flow:

Provider-injection is not available in every situation. Such as:

- mobile web browsers: as of April 2022, browser-extensions do not exist on mobile web browsers (except for mobile-Safari, which added browser-extension support with iOS 15). Furthermore pop-up windows cannot communicate with each other on mobile using `window.posMessage()`, meaning Web Wallet Popups will not work either. Phantom and MetaMask's mobile apps got around this by creating a web-browser directly within their app.

As of now (April 2022), Solana has no standardized redirect flow for wallets. [Solana Pay](https://github.com/solana-labs/solana-pay) is the first attempt to standardize redirect flows.

we use the Solana URL scheme `“solana:...”` to open the user’s wallet-app on their device, approve a transaction request, and then redirect back to our app or website with the response as query params. This works best for web-apps running on mobile-Safari or mobile-Chrome, within native mobile apps, and for kiosks / terminals / any app that runs on an external device. You could also remove desktop browser-extensions entirely; for example, if a dapp on my laptop needed to submit a transaction it could present me with a QR code which I could scan with my phone camera, redirect me into Phantom, and allow me to verify the transaction.

## Possible Dapp-Wallet Pairings:

Dapp, Wallet:
[Desktop site, Browser-Extension or Web-Wallet] = provider injection
[Desktop site, Desktop Program] = link to desktop-program website, pop open desktop native app
[Desktop site, Mobile App] = scan QR code on phone directly in mobile-app or deep-link into mobile app

[Mobile site, Browser-Extension or Web-Wallet] = provider injection
[Mobile site, Desktop Program] = impossible
[Mobile site, Mobile App] = redirect flow per tx request, OR a web-browser within the mobile wallet app

[Mobile app, Browser extension] = impossible
[Mobile app, Web-Wallet] = redirect flow, or provider-injection with pop-up in app
[Mobile app, Desktop Program] = impossible
[Mobile app, Mobile App] = redirect flow per tx request

[Kiosk, Browser extension] = impossible
[Kiosk, Web-Wallet] = web-wallet would need to build app-like capabilities (QR code scanner)
[Kiosk, Desktop Program] = impossible
[Kiosk, Mobile App] = scan QR code per transaction
