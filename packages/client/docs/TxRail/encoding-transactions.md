URLs, including deep-links, can be of arbitrary length; for example, I've base64 encoded images into URLs that are 500,000+ characters long. However QR codes can only support a maximum of 4,269 alphanumeric characters (3 KBs of data) at maximum density. Practically however, beyond 1,000 characters QR codes become difficult to scan because of how dense the pixel-grid becomes.

As a result, serializing Solana transactions and encoding them into URLs / QR codes is not practical. For example, a simple SOL transfer instruction, after being signed, serialized, and base64 encoded, is already 400 - 500 characters long. This effectively rules out any complex transactions.

Ideas:

- A client that wants to present a transaction will need a server to direct the transaction-request to, a dedicated server it controls.
- Or if the client doesn't want to run a dedicated server, it can construct a transaction, then upload that transaction to a URL that hosts it, and then link to that URL. The wallet will request the transaction from that unique URL.
- Or the client could link to a connect-address, and then connect and communicate directly with the wallet via web-sockets or webrtc.
