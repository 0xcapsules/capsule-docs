---
slug: ownership
title: Ownership
---

### Introduction

Ownership is a fundamental module of the capsule standard. It is the module that contains data regarding object ownership and authority, as well as who can transfer ownership of the object.

The module leverages the power of Sui's dynamic field to attach each object's ownership data to the object itself.

With just a few lines of code, any arbitrary Sui object can be made compliant with the capsule standard by invoking one or two functions from the ownership module.

### Ownership structure

The `Ownership` struct is the foundation of the capsule's ownership feature, which is both straightforward and robust. The definition of this struct is provided below.

```
struct Ownership has store, copy, drop {
    owner: vector<address>,
    transfer_auth: vector<address>,
    type: StructTag
}
```

As shown above, the `Ownership` struct possesses the abilities of `store`, `copy`, and `drop`. This combination of abilities allows the `Ownership` struct to function similarly to other primitive types in move.

Let's now explore each field of the `Ownership` struct:

- The `owner` field contains the address(es) of the object owner(s). It may seem more intuitive for this field to have an `address` type instead of the `vector<address>` type that is used. However, the design allows for multiple people to co-own a single object, which is why a vector is used.

- The `transfer_auth` field is also a vector of addresses, but it serves a different purpose than the owner field. It only contains the addresses that are authorized to transfer the ownership of the object to new owner(s). Although this may appear confusing and unnecessary, it is a crucial field because it enables the delegation of asset transfer to other addresses or even Sui packages.

- The `type` field, as its name suggests, holds the type of the object that the ownership belongs to. It is represented by the `StructTag` struct. Further information about the `StructTag` struct can be found [here](#)
