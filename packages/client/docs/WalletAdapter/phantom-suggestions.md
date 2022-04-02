https://eips.ethereum.org/EIPS/eip-1193

- Events
  The Provider MUST implement the following event handling methods:

on
removeListener
These methods MUST be implemented per the Node.js EventEmitter API.

To satisfy these requirements, Provider implementers should consider simply extending the Node.js EventEmitter class and bundling it for the target environment.

message
The message event is intended for arbitrary notifications not covered by other events.

When emitted, the message event MUST be emitted with an object argument of the following form:

interface ProviderMessage {
readonly type: string;
readonly data: unknown;
}

accountsChanged
If the accounts available to the Provider change, the Provider MUST emit the event named accountsChanged with value accounts: string[], containing the account addresses per the eth_accounts Ethereum RPC method.
