---
title: Introduction
description: Motivation and background
slug: /
sidebar_position: 1
---

## What is Sui?

Sui is a next-gen permissionless distributed database, coming summer 2023. These databases are commonly referred to as 'blockchains' (although Sui does not organize its transactions into blocks). Transactions on Sui are executed in the Move Virtual Machine, and transaction-specific logic is written using Move, a language custom-built by Facebook for blockchains.

Sui is best used for managing ownership. Move allows developers to define resources, and set the rules by which resources can be modified. "Resources" are different from "data", in that data can be arbitrarily copied (think of MP3's), whereas resources are limited in quantity (think of dollars in a bank account); it is programmable scarcity.

## What is a Capsule?

Capsules are programmable units of ownership; they serve as a generic container for arbitrary resources on Sui.

### What Problems Capsules Solve

**1. Genericness:** Move does not allow dynamic dispatch, or rather, calling into unknown code. That is, you can only write a module that calls into functions that are already defined by an existing module, not some hypothetical future module. Let's suppose we create a module, deployed at `capsules::outlaw_sky`, that has tradeable resources, like `Outlaw`. Clutchy.io is working on an asset marketplace, and they want to create a market for these outlaw_sky assets. In that case, they must build a module that calls into `capsule::outlaw_sky::transfer(outlaw: Outlaw)`. Great. Next Rushdown Revolt decides to come to Sui. Now Clutchy must write a new module for their asset marketplace, that calls into `rushdown_revolt::characters::transfer(fighter: Fighter)`. And so on and so forth; Clutchy is going to have write new code for every new asset-collection that comes out; that's a lot of work!

Instead, we define a more generic interface, such as `capsules::royalty_market::transfer<T>(capsule: Capsule<T>)`. Both Outlaw Sky and Rushdown Revolt can store their assets within a Capsule, and Clutchy can take advantage of this by writing all their module code for `capsule::royalty_market` functions, which will work for all past future Capsules.

**2. Capsule Cookbook:** Our goal is to deliver low-code Capsule Creation; creators can pick from a cookbook of tested, audited, open-source modules that provide the exact functionality they're looking for, while writing a minimal amount of custom code. There's no need for Capsule Creators to have to understand the complexities of on-chain ownership; it just works.

**2. Displaying Metadata:** Wallets, blockchain explorers, and marketplaces will be reading the Sui blockchain and being like 'what is this resource? How do I display it to someone?'. We've built a generic system that allows metadata to be attached to any Sui Object; this describes the object and provides URLs to off-chain data, such as images or websites. Wallets and blockchain explorers can easily query the metadata of any object on-chain, and use it to display resources to people.

### Why Drop the Term 'NFT'?

Capsules are the successor to NFTs. They are a rebranding and expansion of what NFTs could have been.

"NFT" is a reference to the ERC-721 / ERC-1155 standards on Ethereum, which shares nothing in common with our Capsule Standard or with Sui's programming model. ERC-721 is simply a way to associate metadata with objects (which is actually as boring as it sounds). Meanwhile NFT-shillers created a bunch of ponzi-schemes around the technology, giving it a bad name by over-promising a bunch of nonsense functionality that was never possible and was never seriously thought out; you will never see any serious adoption of "NFTs as event tickets", "NFTs as identity", "NFTs for mortgages", "import skins into other video games!" on Ethereum.

Also, "Fungibility" is a weird, esoteric word, and seems like an odd thing to focus on. More interesting: (1) NFTs are digital assets that exist in a giant crytographic decentralized network, (2) their ownership can be verified and transfered without an intermediary, and (3) they hold on-chain state that can be read and modified.

## Github Repos

[All Github Repos](https://github.com/orgs/capsule-craft/repositories)

This documentation is open-source and community-maintained, so feel free to add or change anything by editing files in the [/docs folder](https://github.com/capsule-craft/capsule-docs/tree/master) and then submitting a pull-request.
