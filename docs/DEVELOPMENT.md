# Shinra Dashboard development and release rules

## Branches and release

- `dev` receives feature work and runs verification.
- `main` receives only verified `dev` changes.
- A `vX.Y.Z` tag on the verified source triggers **Release Shinra Dashboard**.
- The Release asset is always `shinra-dashboard.zip`, containing `dist/` at its
  root. Verification artifacts and branch builds are not a substitute for it.

## Runtime contract

- The normal deployment is direct LAN access at the sing-box API listener.
- Reverse-proxy support is optional and is selected by Shinra only for a
  configured public Origin.
- The Dashboard accepts only a same-origin API path supplied by Shinra and uses
  it for all gRPC-Web and WebSocket traffic.
- NPS configuration is external: dashboard code must not add NPS credentials,
  server management, TLS management or local proxy dependencies.

Any change to these rules requires explicit approval before implementation.
