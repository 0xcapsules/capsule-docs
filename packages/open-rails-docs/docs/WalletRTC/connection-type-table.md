---
title: Connection Table
description: enumerating the types of wallet connections
slug: /connection-table
sidebar_position: 2
---

These are all possible dapp <-> wallet communication pairings, and our recommended solution for each:

|                     |                Browser Extension                 |                  Web-Wallet                   |                  Mobile Wallet                  |      Desktop Wallet      |
| :------------------ | :----------------------------------------------: | :-------------------------------------------: | :---------------------------------------------: | :----------------------: |
| **Desktop Website** | [Provider-injection from extension](#connect-01) | [Provider-injection from iframe](#connect-a2) |            [WalletRTC](#connect-03)             | [WalletRTC](#connect-04) |
| **Desktop Program** |
| **Mobile Website**  |                        X                         |              Provider-injection               | Provider-injection via mobile browser extension |        Wallet-RTC        |
| **Mobile App**      |
| **Remote Server**   |
| **Kiosk**           |
| **Dummy Device**    |

---

## Desktop web-dapp <->

- <h3 id="connect-01"><b>Browser Extension</b></h3>
  Provider Injection: the browser-extension injects a global object, such as window.solana, into the web-dapp page, which the dapp then interacts with. This was popularized by MetaMask.<br/><br/>

- ### Web Wallet {#connect-a2}

  Provider Injection: the web-dapp adds a wallet adapter library. This library creates a hidden iframe for the web-wallet, providing the web-wallet with its own separate exeuction environment. The wallet adapter library injects a global object, such as window.solana, which the dapp communicates with using the same interface [as above](#connect-01). Behind the scenes the iframe and wallet-adapter library communicate with `window.postMessage()` methods. This is how Torus wallet works. A redirect flow is also possible (dapp -> web-wallet domain -> dapp), where communication is done via encoded query-params included in the URL, although from a UI point of view this solution is less elegant.

- <h3 id="connect-03"><b>Mobile Wallet</b></h3>
  WalletRTC: We establish a direct WebRTC connection between the two applications. <br/><br/>

- <h3 id="connect-04"><b>Desktop Wallet</b></h3>
  WalletRTC: We establish a direct WebRTC connection between the two applications. <br/><br/>

- **Desktop Webapp <-> Native Desktop Wallet Program:** Provider Injection <-> Native messaging. The desktop program will have to build its own browser extension (or hook into an existing browser extension built for this use-case), which will act as a middle-man between the webapp and the desktop program. (See: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging) Note that you can deep-link from websites into desktop programs as well.

- **Desktop Webapp <-> Mobile Native Wallet App:** WalletRTC. We establish a direct WebRTC connection between the two applications.

### Mobile webapps

- **Mobile Webapp <-> Web-Wallet:** provider-injection; this gives hidden iframes the edge over browser-extensions. A redirect flow is also possible, although less elegant.

- **Mobile Webapp <-> Native Desktop Wallet Program:** WalletRTC. The desktop program would have to display a QR-code, or vice-versa, and the webapp widge would need to be able to access the camera in order to scan it. This would establish a WebRTC conection.

- **Mobile Webapp <-> Mobile Native Wallet App:** Provider-injection via browser-extension. iOS is now supporting browser-extensions, which are auto-installed into Safari when users install the corresponding native app. This makes for a seamless experience. (Example: Glow app) (See: https://developer.apple.com/documentation/safariservices/safari_web_extensions/messaging_between_the_app_and_javascript_in_a_safari_web_extension)

### Desktop Program Dapp

- **Desktop program <-> Desktop Browser Extension or Web Wallet:** -

- **Desktop program <-> Native Desktop Wallet Program:** -

- **Desktop dapp <-> Mobile Native Wallet App:** -

### Remote Server

-

### Kiosk

-

### Infeasible Combinations:

- **Mobile Webapp <-> Desktop Browser-Extension:**
-

Dapp, Wallet:
[Desktop site, Desktop Browser-Extension or Web-Wallet] = provider injection
[Desktop site, Desktop Program] = link to desktop-program website, pop open desktop native app
[Desktop site, Mobile App] = scan QR code on phone directly in mobile-app or deep-link into mobile app

[Mobile site, Mobile Browser-Extension or Web-Wallet] = provider injection
[Mobile site, Desktop Program] = impossible
[Mobile site, Mobile App] = redirect flow per tx request, OR a web-browser within the mobile wallet app

[Mobile app, Desktop Browser extension] = impossible
[Mobile app, Web-Wallet] = redirect flow, or provider-injection with pop-up in app
[Mobile app, Desktop Program] = impossible
[Mobile app, Mobile App] = redirect flow per tx request

[Kiosk, Browser extension] = impossible
[Kiosk, Web-Wallet] = web-wallet would need to build app-like capabilities (QR code scanner)
[Kiosk, Desktop Program] = impossible
[Kiosk, Mobile App] = scan QR code per transaction
