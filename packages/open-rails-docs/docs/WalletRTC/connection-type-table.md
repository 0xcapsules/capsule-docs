---
title: Connection Table
description: enumerating the types of wallet connections
slug: /connection-table
sidebar_position: 2
---

Intro to dapp types:[^1]

Kiosk: These are devices the user does not own or control, and are usually point of sale devices. They may include (1) a dedicated physical device (such as the check-in kiosk in an airport, or a checkout kiosk at McDonalds), (2) a device repurposed to be a point-of-sale device (such as a food-truck owner with an iPad or iPhone running a dapp in a browser or as a native app), or (3) an NFC emitter with no user interface.

Tag: a fixed encoding that cannot change, such as a QR code printed on a sticker, or a read-only NFC tag. A tag could present you (1) with a link to a transaction-request server that will respond with a complete transaction, such as how Solana Pay v2 works or (2) a partial or complete transaction, such as 'send USDC token to this address' or 'mint this NFT', which your wallet will need to be able to understand and interpret into a complete transaction. Note that if the tag links you to a website then this should be considerd a mobile-website use-case, not a tag use case.

Intro to wallet types:

These are all possible dapp <-> wallet communication pairings, and our recommended solution for each:

|                     |                    Browser Extension                    |                  Web-Wallet                  |                         Mobile Wallet                          |                     Desktop Wallet                      |
| :------------------ | :-----------------------------------------------------: | :------------------------------------------: | :------------------------------------------------------------: | :-----------------------------------------------------: |
| **Desktop Website** | [Provider-injection via browser extension](#connect-a1) | [Provider-injection via iframe](#connect-a2) |                    [WalletRTC](#connect-a3)                    | [Provider-injection via browser extension](#connect-a4) |
| **Desktop Program** |             [Native messaging](#connect-b1)             |              [???](#connect-b2)              |                    [WalletRTC](#connect-b3)                    |         [Cross-App Communication](#connect-b4)          |
| **Mobile Website**  |                    [X](#connect-c1)                     | [Provider-injection via iframe](#connect-c2) | [Provider-injection via mobile browser extension](#connect-c3) |                [Wallet-RTC](#connect-c4)                |
| **Mobile App**      |                    [X](#connect-d1)                     |              [???](#connect-d2)              |     [App extension / Intent (or deeplinks?)](#connect-d3)      |                [Wallet-RTC](#connect-d4)                |
| **Kiosk**           |                    [X](#connect-e1)                     |              [???](#connect-e2)              |                    [WalletRTC](#connect-e3)                    |                    [X](#connect-e4)                     |
| **Tag**             |                    [X](#connect-f1)                     |              [???](#connect-f2)              |           [Parsing based on a standard](#connect-f3)           |                    [X](#connect-f4)                     |

---

## Desktop Website &harr;

- ### Browser Extension {#connect-a1}

  Provider Injection: the browser-extension injects a global object, such as window.solana, into the website's page, which the dapp then interacts with. This was popularized by MetaMask.

- ### Web Wallet {#connect-a2}

  Provider Injection: the website adds a wallet adapter library to its bundle. This library creates a hidden iframe for the web-wallet, providing the web-wallet with its own separate execution environment. The wallet adapter library injects a global object, such as window.solana, which the website communicates with using the same interface [as above](#connect-a1). Behind the scenes the iframe and wallet-adapter library communicate with `window.postMessage()` methods. (See Torus wallet for example.) A redirect flow is also possible (ex: website &rarr; web-wallet domain &rarr; website), where communication is done via encoded query-params included in the redirect URLs (this is how the default NEAR wallet operates), although from a UI point of view this solution is less elegant and maybe insecure if a malicious browser extension is able read and modify the redirect URL query params.

- ### Mobile Wallet {#connect-a3}

  WalletRTC: the website adds a WalletRTC library to its bundle (ideally included with a wallet adapter library). This presents a QR code, which the user scans using their mobile-wallet. This uses a signaling server to establish a direct WebRTC connection between the two devices, which allows for message-passing.

- ### Desktop Wallet {#connect-a4}

  Provider Injection: The desktop program will have to build its own browser extension, or hook into an existing browser extension built for this use-case, which will act as a middle-man between the website and the desktop program. The browser extension can use [Native Messaging](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging) to communicate with the Desktop Wallet directly. To help the UI, a deeplink could be added that redirects the user from website &rarr; Desktop Wallet each time a request is made.

## Desktop Program &harr;

- ### Browser Extension {#connect-b1}

  Native messaging: the browser extension will have to add functionality that allows for native-messaging, so that the browser-extension and desktop program can communicate on an OS-level. This communication has no standardization that I'm aware of yet.

- ### Web Wallet {#connect-b2}

  ???

- ### Mobile Wallet {#connect-b3}

  WalletRTC: the desktop program will need some WalletRTC library that allows it to present a QR code for the user to scan with their phone, establish a WebRTC connection, and then handle message-passing.

- ### Desktop Wallet {#connect-b4}

  Cross-app communication: the two desktop programs can talk to each other at the Operating-System level. Implementations will be different for [MacOS](https://developer.apple.com/documentation/foundation/nsxpcconnection) versus [Windows](https://blogs.windows.com/windowsdeveloper/2015/09/22/using-cross-app-communication-to-make-apps-work-together-10-by-10/), and there are many potential wasy to build this. No standard method exists for this yet.

## Mobile Website &harr;

- ### Browser Extension {#connect-c1}

  X: it is not feasible for a desktop browser extension to talk to another physical device.

- ### Web Wallet {#connect-c2}

  Provider-injection: this will function identical to the [desktop version](#connect-a2). Going from a desktop to a mobile environment requires no extra work, which is one of the advantages iframes have over browser-extensions.

- ### Mobile Wallet {#connect-c3}

  Provider-injection: as of iOS 15, iPhones now support browser-extensions. When you install a mobile wallet, it can install a corresponding browser-extension into Safari automatically. This browser extension ferries information between the mobile website and the mobile wallet. If the mobile site is using a wallet adapter library, the mobile wallet can communicate via an iframe, making a seamless single-screen user experience. (Example: Glow app) (See: [Sarari extensions](https://developer.apple.com/documentation/safariservices/safari_web_extensions/messaging_between_the_app_and_javascript_in_a_safari_web_extension).) A redirect flow is possible (e.g., site &rarr; deeplink to mobile website &rarr; site) but the problem with this flow is that it will break SPA sites (single page application) and will require a lot of custom logic on the part of the website.

- ### Desktop Wallet {#connect-c4}

  WalletRTC: the desktop wallet will need a WalletRTC library which allows it to present a QR code and handle the connection. The mobile website will need the ability to scan QR codes built into its WalletRTC library.

## Mobile App &harr;

- ### Browser Extension {#connect-d1}

  X: it is not feasible for a desktop browser extension to talk to another physical device.

- ### Web Wallet {#connect-d2}

  ???

- ### Mobile Wallet {#connect-d3}

  App extensions (or Deeplinks?): The ideal flow would be to use [App Extensions](https://developer.apple.com/app-extensions/) on iOS, or [Intents](https://developer.android.com/guide/components/intents-filters) on Android. We would first create component libraries (React Native, Swift / Objective-C, and Kotlin) that will be included in the Mobile App. These components would make calls to mobile-wallets on the same operating-system, and allow for communication between the two. The ideal UI would be a bottom-sheet that comes up, making a request from the mobile-wallet, without any app redirection needed. This would mimic the behavior of Apple's Apple-Pay screens built into iOS. This may prove infeasible or insecure however. Meanwhile, Phantom has developed a [deeplinking scheme](https://docs.phantom.app/integrating/deeplinks) for its mobile wallet. It does an app &rarr; wallet &rarr; app redirect flow, communicating via encrypted query params in the redirect URL. This may be the best possible solution.

- ### Desktop Wallet {#connect-d4}

  WalletRTC: the desktop wallet will need a WalletRTC library which allows it to present a QR code and handle the connection. The mobile app will need the ability to scan QR codes and will need its own WalletRTC library.

## Kiosk &harr;

- ### Browser Extension {#connect-e1}

  X: it is not feasible for a desktop browser extension to talk to another physical device.

- ### Web Wallet {#connect-e2}

  ???

- ### Mobile Wallet {#connect-e3}

  WalletRTC: whatever software the kiosk is running, it will need a WalletRTC library which allows it to present a QR code for the user's mobile wallet to scan. This will establish a direct WebRTC connection and handle message passing. Alternatively if a screen is not available, we could do the reverse; the kiosk could have a scanner that scans a QR code presented by the user's mobile wallet. Alternatively we could use the WalletRTC-NFC library, and exchange data via NFC. An important use-case is when internet is unavailable for the mobile-wallet; it should be possible for the wallet app to receive, sign, and return transactions to the kiosk via NFC without an internet connection, with the expectation that the kiosk will broadcast the transaction itself. This will solve for use-cases where customers have poor cellular connections, while merchants have dedicated wifi (such as at music festivals).

- ### Desktop Wallet {#connect-e4}

  X: desktop computers are not mobile, so it's infeasible to use them.

## Tag &harr;

- ### Browser Extension {#connect-f1}

  X: it is not feasible for a desktop browser extension to talk to another physical device.

- ### Web Wallet {#connect-f2}

  ???

- ### Mobile Wallet {#connect-f3}

  Parsing based on a standard: the wallet will need to be able to parse the contents of the tag according to some standard. The wallet will need to recognize the standard and have implemented it. The wallet may have all the information it needs to complete the transaction (Solana Pay v1), or it may need to make a network request linked to by the tag-data to fetch the full transaction (Solana Pay v2).

- ### Desktop Wallet {#connect-f4}

  X: desktop computers are not mobile, so it's infeasible to use them.
