---
title: Auth Standard Proposal
description: A proposed expansion of the Solana Pay standard
slug: /auth-proposal
sidebar_position: 1
---

We propose an expansion on the Solana Pay Standard to provide an authentication standard using any crypto wallet.

## Background:

There are two fundamentally different flows for a dapp to interact with a user’s wallet:

**- Provider Injection:** the wallet is a browser extension that injects a global object, like window.solana, which our dapp can interact with. This works best for web-apps running on a desktop browser. Mobile browsers do not currently support browser extensions (except for mobile-Safari, which added its own browser-extensions on iOS 15, although there are no crypto-wallets available yet). To get around this, MetaMask and Phantom have built browsers within their mobile apps; users visit a dapp from this in-app browser, allowing for global provider injection.

**- Deep-Linking:** we use the Solana URL scheme `“solana:...”` to open the user’s wallet-app on their device, approve a transaction request, and then redirect back to our app or website with the response as query params. This works best for web-apps running on mobile-Safari or mobile-Chrome, within native mobile apps, and for kiosks / terminals / any app that runs on an external device. You could also remove desktop browser-extensions entirely; for example, if a dapp on my laptop needed to submit a transaction it could present me with a QR code which I could scan with my phone camera, redirect me into Phantom, and allow me to verify the transaction.

### Problems with ‘solana:’ URL scheme and how to fix Deep-Linking:

- On iOS it’s ambiguous what will happen if multiple apps register to handle the same URL scheme. Currently when I scan a QR code with ‘solana:...’ my iPhone will open my FTX US app, which does nothing. If I uninstall FTX, reboot my phone, and try again, it still won’t open my Phantom Wallet app for some reason–has Phantom app not registered the Solana URL scheme yet? (This may work better on Android, which features disambiguation screens for links–not that Phantom is on Android yet.) But the point is that if I were clicking a ‘solana:’ deep-link in an iOS app as a user, I would have no way of making sure that this request is directed to my preferred wallet app.
- I would recommend using Universal Links on iOS and Android App Links on Android. Each mobile wallet app should register their own url, something like `https://phantom.app/code?<params>`
- This provides a better UX, because if the user has no apps installed that handle the ‘solana:’ url, they will simply get an unintuitive ‘no usable data found’ message when they try to use it. However if the user scans a deep-link like [https://phantom.app/code…](https://phantom.app/code%E2%80%A6) they will be directed to phantom’s website in their browser, and phantom’s website can prompt the user to install their wallet from the app store.
- When using a mobile browser or using a mobile app, we can add some UI that allows users to select their wallet. Example: tap a button which says ‘Send 0.1 SOL’ > this pops up a dialogue listing supported wallets > user clicks Phantom, which opens https://phantom.app/code?... routing the user to their phantom wallet app > user confirms transaction > user is routed back to the original app specified in a redirect_uri. The user’s wallet preference can be remembered for future interactions to skip this step. Ideally this could be used for in-app purchases that circumvent Apple’s 30% tax.
- [Apple v Epic Games Court Ruling](https://www.theverge.com/2021/9/10/22662320/epic-apple-ruling-injunction-judge-court-app-store)
- When such a user-selection is not possible (such as a fixed QR code or a fixed NFC link), the payment url can direct to a merchant-specific Linktree page; a url that opens a page that allows users to select their preferred wallet. This page will contain a list of supported wallets and a deep like to those wallets, like `https://phantom.app/code?<params>`. As a last resort, we can use the Solana URL scheme ‘solana:’ and hope this routes the user somewhere useful. However the above wallet-specific url and linktree methods should always be preferred. **That is, the 'solana:' URL scheme should only be used as a last resort**.
- To accommodate deep links, I propose adding a `request=` query param to the standard, which has a URL-encoded URI to which the wallet will make a transaction request.

### How signMessage authentication currently works with Provider Injection:

- signMessage is currently only possible with global provider injection.
- Upon approving the connection, the client app is provided with the user’s pubkey and a signMessage() method.
- The user’s wallet receives a signature request, with an arbitrary Uint8Array
- The user’s wallet uses the private key to create a signature of that arbitrary Uint8Array
- The client-app verifies that the signature is legit, by comparing the signature with the original message and pubkey. This proves to the client-app that the person they’re talking to does indeed control that pubkey.

### Security Problems:

- Every website I’ve seen using this signMessage method for authentication is insecure, including magiceden.io. Fortunately these insecure sites are mostly obscure NFT projects, with no major data at risk yet.
- It’s trivially easy to construct a message that is actually an arbitrary transaction. The user will simply see a bunch of garbled characters in its signMessage request, and not understand that they are signing a transaction.

## Solana Auth Proposal:

### How to adapt signMessage to work with Deep Linking:

1. On a mobile web browser or in a mobile app, the user clicks a ‘Sign in with solana’ button which deep-links to the user’s wallet, OR the user opens their mobile camera-app and scans a QR code. The merchant presents the following auth link:

```
solana:https%3A%2F%2Fmerchant.com%2Fsolanaauth?label=merchant&message=sign%20this%20please
https://phantom.app/code?request=https%3A%2F%2Fmerchant.com%2Fsolanapay&label=merchant&message=sign%20this%20please
```

- The addition of a `request=` query param to the spec allows for us to use deep links.
- This URL format is meant to be identical to the Solana Pay spec. The server responding to the request should understand from the route that a challenge is being requested rather than a transaction.

2. The wallet parses the link and optionally prompts the user for permission to make the request; this should be considered the same as a wallet-connect. The label and message params can optionally be displayed, but more importantly the wallet should display the url of the server to which the request will be directed. The permission step can be skipped if the wallet has connected to this domain before.

3. If permitted, the wallet makes a POST request to the specified url (which will be referred to as the authentication server from here on out). The label and message params will not be used again. The JSON body should have a `{ “account”: <pubkey> }` format
   Example url: `https://merchant.com/solanapay?auth=true`

4. The authentication-server generates a nonce and a message, and then generates a challenge, which is a 3-part comma separated utf-8 string, with the format:
   `${origin},${nonce},${pubkey}`
   where origin should match the origin of the redirect URI, the nonce is a randomly generated alphanumeric string, and the pubkey is the pubkey being requested for authentication. The pubkey-portion should be considered optional in this format.
   Example:
   `https://merchant.com,GCQLiawuDQbaaxFUAKcGpvQxfSxddZwGDp8p4Q57DfoX,17FaeoyXD2`
   This will be returned as a Uint8Array. The authentication server then saves the pubkey and challenge as a key-value pair, with an expiry time after which the pair will be discarded from memory. It also adds a redirect_uri and an expiry time that is an epoch time value in the future. It then returns the following (signed or unsigned)) JWT response, with this being the JSON body:

```
{ “message”: utf-8 string (optional),
“challenge”: <challenge> Uint8Array,
"redirect_uri": URI,
"expiry": epoch time value }
```

5. The user’s wallet displays the redirect_uri domain and message, and optionally prompts the user to sign the undisplayed challenge. If granted, the user’s wallet generates a signature using the private key, and immediately redirects to the specified URI, including the pubkey and signature as query params:

```
<redirect-uri>&from=<pubkey>&signature=<signature>
https://merchant.com/solanaauth?&param1=value&from=GCQLiawuDQbaaxFUAKcGpvQxfSxddZwGDp8p4Q57DfoX&signature=<sig>
```

- It’s important that the user’s wallet should examine the challenge and verify that the challenge is NOT a transaction. Currently (March 2022) it is trivial to trick Phantom into signing an arbitrary transaction without the user’s knowledge using the signMessage method.
- It is important for the wallet to verify that the origin included in the challenge matches the origin of the authentication server to which it will be sent (the redirect URI). If these origins do not match, reject this authentication-attempt as malicious before asking the user for a signature. This prevents an authentication forwarding-attack; for example, suppose pubkey123 sends a request to malicious.com to authenticate, but at the same time behind the scenes malicious.com asks to authenticate pubkey123 at magiceden.io, and then forwards that challenge to our user. In that case, if the user signed it, they thought they were authenticating with malicious.com, but actually they just gave malicious.com authentication to their pubkey123’s magiceden.io account. However, if we include the domains in the challenge to sign this is not possible; the wallet will clearly see that magiceden.io !== malicious.com, and reject the request. If malicious.com modifies the magiceden.io authentication request it got to add its own name as the origin, then when our wallet signs it and returns it to malicious.com, malicious.com will not be able to use this to authenticate on magiceden.io because magiceden.io will see that the signature returned does not match the challenge it sent.
- It is important to use a nonce to prevent replay attacks; even if this signature was intercepted and saved, this signature cannot be used to authenticate a second time because the authentication server will issue a different challenge every time. Additionally it is impossible for an attacker to predict what the challenge will be.
- Including the pubkey in the challenge ensures that the challenge can only be used to authenticate by the pubkey for which the challenge was generated. However the pubkey should be considered to be an optional part of the challenge template.
- Including an optional expiry date in the challenge ensures that the authentication challenge can not be used indefinitely into the future authenticate.
- If the user has already logged into this website before, the connect and signing message steps can be skipped entirely. If this spec is followed there is nothing malicious that can be done by signing the challenge.

6. The authentication-server receives the pubkey and signature as query params, along with anything else included in its predefined redirect uri. It looks up the challenge it sent to that pubkey (if it’s unable to find the message, it rejects the request), and verifies that the challenge, pubkey, and signature match. If the signature is legitimate, the server grants authorization (such as by giving the user’s browser a session-cookie and redirecting the user to a protected route, or whatever system it uses). After which the authentication server discards the pubkey and challenge from its memory.

### Notes:

In oauth, this is called a ‘front channel communication’. A ‘back channel communication’ would be if the wallet sent the signature directly to the authentication-server, rather than including it in the redirect uri. Back channel communications are considered more secure because the two parties share an oauth credential, and if there was some piece of malicious software on the user’s device that could observe the redirect uri, that malicious software could authenticate itself before we get the chance to. However, the main point of this authentication flow is for the authentication server to place an authentication cookie in the user’s browser, so I think front channel communication is the simplest and overall best solution.

### Alternate flow with stateless authentication server:

4. Same as above, except that the server signs the JWT it returns using a secret it controls.
5. When the wallet redirects to the specified redirect_uri, it also includes the original signed JWT in the authorization header, and optionally skips the pubkey as a query param (we will not use it).
6. The authentication-server receives its original JWT, and also the signature as query params. It first verifies that the JWT was not tampered with by examining the JWT signature. It then verifies that the challenge has not expired by checking the expiry time on the JWT. It then grabs the base58-encoded pubkey from the challenge string. It then takes the challenge, pubkey, and signature and verifies that the signature is legitimate. If all of these pass, the authentication-server grants authorization to the user.

- It is important that the challenge has a short expiry time (around 5 minutes). If this JWT and signature were intercepted by someone malicious, they could use it to authenticate an arbitrary number of times, and our stateless authentication-server has no way of revoking these challenges other than letting them expire.

### Proposed Changes to Wallet Interfaces:

- Wallets should expose a more robust method; `requestAuth({ challenge: string, display?: string } ) => resp: { signature: Uint8Array }`. This method works just like signing a message, except that the wallet verifies that the challenge is not actually a transaction, and that the origin inside of the challenge is the origin of the currently connected website before it presents it to the user to sign. This adds an extra layer of security on top of the signMessage() method.

- This opens up the possibility of wallets creating an 'authenticated connect' method, something Glow App is already building. The purpose is to not only get the user's pubkey, but also a proof that the user owns their pubkey as they claim. This method would be an overload of the current `window.solana.connect()` method, except that the client-app provides a server-generated nonce: `window.solana.connect({ nonce: string }) => resp` with the `resp` object extended to contain a `challenge: string` and `signature: Uint8Array` param. The client-app will first fetch a nonce from the server, call the connect method supplying the nonce, and then return the response object to the server. The server will first examine the validity of the challenge-string, which is should be `${origin},${nonce},${pubkey}`, then compare that to the pubkey and signature. If it all checks out, the server will respond with an authentication token to the client.

- Ideally users should be able to auto-connect and auto-authenticate in one method call, without any user interaction or permission required.

### Alternate flow without authentication:

- If authentication is not required, and the app simply wanted to request your public key so it can look up info about you, the authentication server can simply return everything in its JWT as null / undefined except for the redirect_uri. The entire user signature-requesting step can then be skipped and the wallet can immediately redirect to the url as `from=<pubkey>&signature=<blank>`

## Examples:

- **Vending machine:** you want to buy something from a kiosk, however this kiosk displays private information and wants to authenticate you first (such as when checking into a flight). OR this kiosk is restricted to only owners of a certain NFT. OR you want to be able to select which tokens you will pay with first. OR this kiosk remembers users based on their pubkey and gives returning users a discount. The kiosk presents a QR code, which you scan on your mobile phone. It opens your Phantom wallet, which unlocks using your face. You push ‘sign message’, are redirected to a success page, and then within seconds the kiosk identifies you and prompts you to proceed.
- **Mobile login:** you want to sign-in to a website on your phone, which uses Solana pubkeys as an auth factor. You click ‘sign in using Solana’ and the website redirects you to your mobile wallet, which unlocks using your face. You click ‘sign message’ and are then redirected to the website, signed in.
- **Desktop login using mobile wallet:** you want to sign onto a website on your desktop computer which uses Solana pubkeys as an auth factor. You click ‘sign in using Solana’, and the website displays a QR code. You pull out your phone, scan the QR code, are redirected to your Phantom wallet, which unlocks using your face, and press ‘sign message’, and then your desktop computer redirects to a protected route.
- **AR glasses:** wearing AR glasses you look at a wall with a virtual object embedded in it. It’s a virtual kiosk; however only the members of your DAO can use this kiosk. You interact with the virtual-kiosk using a hand gesture, and your AR glasses open a deep link that opens up Phantom on your mobile phone. You unlock your phone and press ‘sign message’, after which the kiosk unlocks and allows you to interact with it.

## Why Solana wallets (like Phantom) should build this:

The above has very broad applicability; even for users who have no interest in crypto, they can still use their wallet application as their preferred authentication method for any website, app, or kiosk that supports it. This greatly expands the use cases of Phantom, for example, beyond Solana. Even people with no interest in Solana could use this system.

This is a zero-knowledge authentication system, in the sense that the user does not have to share any secret information with a remote server. In contrast, when you login using a password and username you are sending that server your password in plaintext, possibly compromising your password if the server mishandles it (such as leaving it in a log file).

Furthermore, this authentication system is non-custodial, and doesn’t require the permission and service availability of a 3rd party resource-provider (such as Google or Facebook…), for either the user or the developer implementing it into their service.

## Future expansions:

### Solana Auth with scopes

One of the beauties of the oAuth / OpenId Connect standard is the ability for the client (application) to request pre-verified information about the resource-owner (user), in addition to just authenticating, which can be used to expedite purchase flows and registration flows. For example, if you’re buying a product online, you can authenticate and give the application your full shipping information in one click.

oAuth calls this a ‘scope’ request. To implement this, in the JWT response containing the server’s request, the authentication-server can add a scope parameter to the body, like:

`{ scope: [name, email, shipping_address, phone_number], …}`

Where each scope is a request for a specific piece of information about you. This information can be stored by your wallet or stored on-chain and encrypted using your pubkey. Your wallet app can then display a message like ‘merchant.com is requesting the following information: name, email, shipping address, and phone number’, and the user can granularly choose which pieces of information it wants to expose.

Transaction requests superseed authorization requests, because the signature for a transaction can already be used to authenticate a user. However, we can combine scopes and transactions to do some interesting things. For example, a kiosk could display a QR code, which when scanned responds with the following transaction request:

```
{ transaction: <transaction>,
scope: [name, email] }
```

This transaction could authorize the kiosk to charge us an unspecified amount within the next few minutes (after I checkout). The scope provided gives the kiosk an email address to mail the receipt to, and the name gives the restaurant owners a name to associate with my order.

In Denver there's a restaurant called Bird Call, and they have a kiosk that does exactly this with my credit card; I swipe it once and then it (1) recognizes me by name, so the restaurant employees know who to give my order to, (2) it emails me a receipt, and (3) it charges my card for however much I ordered when I checkout. I’ve seen several kiosks that now use credit cards for authentication in addition to charging for purchases, such as airport check-in kiosks.
