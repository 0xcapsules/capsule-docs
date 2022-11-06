---
title: Introduction
description: Motivation and background
slug: /
sidebar_position: 1
---

# What Is a Noot?

**Noot:** a programmable unit of ownership. (plural: noots)

Think of Sui as a database, and noot as a filetype in that database. All files are formatted in the same way, and use the same set of APIs to be interacted with.

### What Problem Noots Solve

**1. Genericness:** Move does not allow dynamic dispatch, or rather, calling into unknown code. That is, you can only write a module that calls into functions that are already defined by an existing module, not some hypothetical future module. Let's suppose we create a module, deployed at `openrails::outlaw_sky`, that has tradeable resources, like `Outlaw`. Clutchy.io is working on an asset marketplace, and they want to create a market for these outlaw_sky assets. In that case, they must build a module that calls into `openrails::outlaw_sky::transfer(outlaw: Outlaw)`. Great. Next Rushdown Revolt decides to come to Sui. Now Clutchy must write a new module for their asset maketplace, that calls into `rushdown_revolt::characters::transfer(fighter: Fighter)`. And so on and so forth; Clutchy is going to have write new code for every new asset-collection that comes out; that's a lot of work!

Instead, we define a more generic interface, such as `noot::market::transfer<T>(noot: Noot<T>)`. Both Outlaw Sky and Rushdown Revolt can define their assets as noots, and Clutchy can take advantage of this by writing all their module code for `noot::market` functions, which will work for all past future noot-collections. When new functionality is added to the noot::market module, all collections benefit from it without having to do any extra work. Plus noot creators won't have to write any custom code; they can simply pick from a buffet of tested, and audited, open-source modules that provide the exact functionality they're looking for. Much easier for everyone!

The long-term goal is enable no-code noot creation.

**2. Off-chain displays:** Wallets and blockchain explorers will be reading the Sui blockchain and being like 'what is this resource? How do I display it to a user?'. By having a standard way to store pointers to off-chain data (.png, .mov, .fbx, .html...) wallets and explorers can easily parse on-chain display data to figure out what static files are available, load the off-chain content, and display it to their users.

### Why Drop the Term 'NFT'?

Noots are the successor to NFTs. They are a rebranding and a reimagination of what NFTs could have been.

"NFT" is a reference to the ERC-721 and ERC-1155 standards on Ethereum, which shares nothing in common with the noot standard or with Sui's programming model.

"Fungiblility" is a weird, esoteric word, and seems like an odd thing to focus on. What are their interesting parts? They're digital assets that exist in a giant crytographic decentralized network. Their ownership can be verified and transfered. They hold on-chain state that can be read and modified. (...or in the case of Solana, they're mere pointers to a JSON file stored on an AWS server lol.)

## Github Repos

[All Github Repos](https://github.com/Open-Rails)

This documentation is open-source and community-maintained, so feel free to add or change anything by editing files in the [/docs folder](https://github.com/Open-Rails/Docs/tree/master/packages/open-rails-docs/docs) and then submitting a pull-request.
