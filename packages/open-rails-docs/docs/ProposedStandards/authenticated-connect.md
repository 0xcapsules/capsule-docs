Proposal:
The wallet, in addition to returning the pubkey upon connect, also returns:

{message, signature}

where message: `${origin},${timestamp}` such as `https://magiceden.io,1647985555`
and signature is a signature of the message using the private key.

The server will recieve the pubkey, message, and signature, and verify them.
The server should check the timestamp and reject if it's more than 5 minutes old. It should
check the origin and reject if it's not its own origin.
If everything checks out, the user will be authenticated.

Potential problems with this:

1. signatures can be generated arbitrarily into the future because messages are predictable. For example:
   malicious.com wants to login as pubkey123. When pubkey123 connects to malicious.com, malicious.com requests a signature of `https://magiceden.io,(5 minutes from now)`. If the user signs this message, malicious.com will be able to authenticate as that user in a 5 - 10 minute window from now. This can be repeated arbitrarily (i.e., 5 years from now on). Essentially what that would mean is that malicious.com could login at some specificied point in the future,
2. The user with the private key could generate an arbitrary number of 'sign in' tokens, which can be redeemed as far into the future as he likes. He could give this away to anyone as a form of password sharing (such as a netflix account, for example). There would be no way for the server to invalidate this sort of password-sharing, other than tracking devices / ip-addresses. I suppose with my
3. If you were given a wallet by your employer and used it for SSO purposes, and got fired, you could generate a bunch of pubkey proofs and store them, and use them to login again at some future date. The only way for your employer to stop this would be to delete the pubkey you used out of their system, which isn't a big deal.

How TLS works:

1. the client sends a 'client random'
2. the server responds with its SSL certificate and a 'server random'
3. the client examines the SSL certificate; it should be signed by a certificate authority (CA) that the client trusts. The client verifies the CA signature is legitimate. It also grabs the public key from the SSL certificate.
   - This DOES NOT verify that the server is who it claims to be; anyone can send this SSL certificate and a server random. What it does verify is the public-key associated with the domain, so long as the client trusts the CA is honest. If the server is an imposter, it will be unable to proceed with step 5.
4. the client then generates a 3rd and final secret; the 'premaster secret', encrypts it using the server's pubkey, and then sends it to the server. The client then uses the client random + server random + premaster secret to generate a symmetrical session key. All future communication will be encrypted with this secret key. The client then sends a 'finished' message encrypted with this key.
5. the server uses its private key to decrypt the premaster secret. It then constructs the same symmetrical secret key the client did in step 4 (the generation method is deterministic). The server then sends a 'finished' message encrypted with this key.
