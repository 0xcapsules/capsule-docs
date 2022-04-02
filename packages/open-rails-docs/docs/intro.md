---
title: Introduction
description: Motivation and background
slug: /
sidebar_position: 1
---

# Introduction

OpenRails is an open-source suite of tools for wallet and dapp developers building on Solana. Similar to EIP (Ethereum Improvement Proposals) we collect and debate community-written standards for Solana. As the Solana ecosystem grows, standards will keep projects interoperable and save developers time so we're not reinventing the wheel differently / duplicating work.

Current Areas of focus:

- Wallet <-> Dapp communication and redirect flows
- Authentication standard
- Transaction-construction libraries for merchants
- Transaction verification and observation libraries for merchants

## Github Repos

- ConnectRail: this is a Wallet <-> Dapp communication protocol, similar to Wallet Connect 1.0 on Ethereum. It consists of an open-source signaling server that establishes a WebRTC data channel between a dapp and wallet. Once the data channel is established, all communication occurs peer-to-peer and no intermediary server is needed.

[All Github Repos](https://github.com/Open-Rails)

This documentation is open-source and community-maintained, so feel free to add or change anything by editing files in the [/docs folder](https://github.com/Open-Rails/Docs/tree/master/packages/open-rails-docs/docs) and then submitting a pull-request.
