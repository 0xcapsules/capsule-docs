---
title: Common Standard API
slug: /common-standard-api
description: documentation for the common standard api
sidebar_position: 2
---

The common standard API is detailed below. These properties and methods are not supported by every wallet yet, so we list wallet-compatability as well. Please help keep this document updated.

### Properties

`autoConnect: boolean`

`wallets: Wallet[]`

`wallet: Wallet | null`

`publicKey: PublicKey | null`

`connecting: boolean`

`connected: boolean`

`disconnecting: boolean`

### Methods

`select(walletName: WalletName): void`

`connect(): Promise<void>`

`disconnect(): Promise<void>`

`sendTransaction(transaction: Transaction, connection: Connection, options?: SendTransactionOptions): Promise<TransactionSignature>`

`signMessage: MessageSignerWalletAdapterProps['signMessage'] | undefined`

### Deprecated Methods

`signTransaction: SignerWalletAdapterProps['signTransaction'] | undefined`

Phantom is deprecating this method. They recommend you use the sendTransaction method instead, which both signs and sends the transaction.

`signAllTransactions: SignerWalletAdapterProps['signAllTransactions'] | undefined`

Phantom is deprecating this method.
