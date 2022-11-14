---
title: Introduction
description: Deriving Noots
slug: /
sidebar_position: 2
---

### Design Constraints

Noots are a programmable unit of ownership. But what do we want them to do? Well:

- Have 'ownership' in the sense that the noot-author can gate who can use the noot, and in what way
- Have customizable ownership transferability logic, as specified by the needs of the noot-author
- Store data
- Store resources of value, including other noots
- Be interopable, in the sense that multiple modules can read and write data to a noot, and store or withdraw resources of value with the noot
- Store pointers to off-chain data that can be used by external programs. A reader must be able to independently verify the integrity of the off-chain data.

### Ideal World

In an ideal world, a noot would simply be a root-level object, with just 'key'. This would make accessing a noot easy; for the example function:

`public entry fun use_noot(noot: &mut Noot) {}`

we would simply specify the UID of the noot, something like: `0xc3fb66bf97df7af4c67795ced3a07b31032a5406` and we'd be good.

Additionally, your ability to access the the object in the first place would be proof enough of ownership, i.e., we'd only be able to use `0xc3fb66bf97df7af4c67795ced3a07b31032a5406` in an entry-transaction if we (the transaction signer) are the Sui-defined owner of it.

Additionally, we'd be able to switch our noot from single-writer mode -> shared-mode, if we want other people to be able to use our noot in transactions, while still also being the owner, and then switch it back from shared-mode -> single-writer mode, in order to take advantage of the efficiencies afforded by single-writer objects.

### Problem

However, we want to be able to store noots as well, such as in another noot's inventory. So we must also add the 'store' ability as well to do this. Unfortunately, this opens up a plethora of undesirable consequences: (1) any other module can create a custom struct + custom retrieval logic that stores our noot, preventing our own noot-standard logic and any noot-module's logic from working; they are essentially 'hacking' our noot, (2) any noot can be polymorphic-transferred, i.e., they can simply use sui::transfer::transfer(noot, new_owner) in order to change ownership. Many noot-modules will want their noots to be non-transferable entirely, or subject to some transfer-restrictions.

There is an additional problem; objects cannot be unshared in Sui. So once we share a noot for the first time, it can never be unshared again. Once destroying shared-objects is available in Sui we could potentially share a noot, and if we want to unshare it, we simply destructure it and use its pieces to assemble a new clone-noot. That would work, unfortunately Sui does not support moving a UID from one destructured object into a new one (let's call this **object-rebirth**), which means our noot would have to have a new UID every time it goes through this, which wouldn't be so bad necessarily.

### Reality

Instead, we introduce a wrapper, called `EntryNoot`, which is a struct with only 'key', that contains a noot. We then place our noot, with key + store inside of this wrapper. This makes our noot-API a little more complex, for example we must now do:

```
public entry fun use_noot(entry_noot: &mut EntryNoot) {
    let noot = noot::borrow_entry_mut(entry_noot);
}
```

We must now use this in EVERY function call where we want to use a noot (ugh). However, as long as we protect our wrapped noot, i.e., we only allow the noot-standard and noot-modules to remove their own noots from an EntryNoot, then we'll be safe from unwanted wrapping and polymorphic transfers.

Additionally, whenever we want to unshare a noot we can simply remove it from its old EntryNoot and place it inside of a new single-writer EntryNoot object.

Additionally, if we want to specify who the owner is we'll have to add an `owner: address` field to the EntryNoot, which will act like a permissioning system, gating who has access to the noot. We could instead use a capability object, something like:

```
public entry fun use_noot(entry_noot: &mut EntryNoot, noot_owner_cap: &mut NootOwnerCap) {
    let noot = noot::borrow_entry_mut(entry_noot, noot_owner_cap);
}
```

However, this would complicate our API even further (ughhhh) and if the noot_owner_cap might is transferrable (key + store) we'll be right back in the same situation we were just trying to avoid! That's why we use a hardcoded list of owner addresses instead.

### -
