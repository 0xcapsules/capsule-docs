---
title: Objective and Intro
slug: /wallet-intro
sidebar_position: 1
---

The methods by which wallets operate, and the wallet the end-user chooses to use when interacting with a web-app, should always be irrelevant to web-app developers. Developers should only ever have to concern themselves with a common set of properties and methods shared by all wallets. Providing a simple, uniform wallet API is critical for the success of our ecosystem: we call this the **common standard API**.

The [Solana wallet-adapter library](https://github.com/solana-labs/wallet-adapter/tree/master/packages/wallets) provides a collection of adapter-library packages. These 'adapter libraries' translate the wallet's own idiosyncratic API into the common standard API.

Also available are [convenience libraries](https://github.com/solana-labs/wallet-adapter/tree/master/packages/core) that make it easy to interact with the common standard API, and [UI components](https://github.com/solana-labs/wallet-adapter/tree/master/packages/ui) for web-app developers to use.
