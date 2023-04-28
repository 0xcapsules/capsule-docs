---
title: Intoduction to Packages
---

On this page, you can find a brief overview of Sui packages, along with some insights about our packages. Additionally, we have provided links to supplementary learning resources for those who are interested.

## Sui Packages

### Introduction

Sui packages can be considered analogous to smart contracts on other blockchains, but with a crucial difference: instead of being a monolithic entity, they are composed of modules that may or may not be interdependent.

Furthermore, Sui packages are stateless, meaning they do not store data. Rather, data is stored in globally available units called objects, which can only be created and modified by the packages that define the object type. This sets Sui apart from most other blockchains.

It is very important to note that Sui packages are coded in Sui Move, a variant of Core Move.

#### Supplementary Resources:

- [[The Move Book] Packages](https://move-language.github.io/move/packages.html)
- [[Sui Docs] Write a Sui Move Package](https://docs.sui.io/devnet/build/move/write-package)

### Modules

As previously stated, Sui packages consist of modules that may or may not be interdependent.

Each module defines struct , which can represent Sui objects. Struct defined in a module can only be instantiated and modified within the module they are created, not even in other modules that belong to the same package.

Modules also contain functions that can be used to instantiate and modify their struct . These functions can be publicly exposed to any other modules or to a select few modules known as "friends".

#### Supplementary Resources:

- [[The Move Book] Modules and Scripts](https://move-language.github.io/move/modules-and-scripts.html)

### Objects

In Sui, objects are the fundamental units of storage and are globally accessible on the network, each with a unique 32-byte ID assigned to it.

While Sui objects are also structs, they possess specific properties that distinguish them from regular structs. At the move level, a Sui object must have the following:

- ID field of type `0x2::object::UID`.
- a `key` ability.

In addition, on the Sui network level, a Sui object has:

- an 8-byte unsigned integer version that monotonically increases with every transaction that reads or writes the object.
- a 32-byte transaction digest indicating the last transaction that included it as an output.

#### Object ownership

There are various forms of ownership that Sui objects can have, which include:

- **Address Owned**: Objects that are Address Owned can solely be utilized in transactions by their respective owner, and modifications or deletions to them can only be made by their owner.

- **Object Owned**: Objects can also be owned by other Sui objects through dynamic attachment using Sui Move's dynamic field feature, making them "Object Owned" rather than "Address Owned".

- **Shared**: Shared objects, which are not owned by a Sui address, can be utilized in transactions by any Sui account and modified by any participant on the network, but they cannot be deleted.

- **Immutable**: Immutable objects are also shared objects but cannot be modified.

#### Supplementary Resources:

- [[Sui Docs] Sui Objects](https://docs.sui.io/devnet/learn/objects)
- [[Sui Docs] Object and Package Versioning](https://docs.sui.io/devnet/learn/object-package-versions)

## Capsule Packages

Our packages are comprised of Move modules that are published on the Sui blockchain, allowing for easy creation of Sui objects that adhere to the Capsule asset standard.

These packages are designed with modularity, performance, and ease of integration in mind, making them ideal for developers building on Sui.

Each package can be used independently, providing a seamless process to create Capsule-compliant assets.
