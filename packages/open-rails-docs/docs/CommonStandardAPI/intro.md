---
title: Why this exists
slug: /common-standard-impetus
sidebar_position: 1
---

The methods by which wallets operate, and the wallet the end-user chooses to use when interacting with a web-app, should always be irrelevant to web-app developers. Web-app developers should only ever have to concern themselves with a common set of methods, properties, events, and errors shared by all wallets, and the expected behaviors should be consistent across all wallets. Providing a simple, uniform wallet API is critical for the Solana developer-experience and for consumer choice in selecting the wallet they prefer. A consumer should never be unable to use a web-app because they chose a less-supported wallet, and a Solana web-app developer should never have to write wallet-specific code.

We call this standard the **common standard API**.

Wallet-developers may expand upon these common standard APIs with their own experimental features if they wish, but the core should always be consistent unless the standard is changed.

The [Solana wallet-adapter library](https://github.com/solana-labs/wallet-adapter/tree/master/packages/wallets) provides a collection of adapter-library packages. These 'adapter libraries' translate the wallet's own idiosyncratic API into the common standard API.

Also available are [convenience libraries](https://github.com/solana-labs/wallet-adapter/tree/master/packages/core) that make it easy to interact with the common standard API, and [UI components](https://github.com/solana-labs/wallet-adapter/tree/master/packages/ui) for front-end developers to use.
