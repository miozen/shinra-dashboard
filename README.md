# Shinra Dashboard

Shinra Dashboard is a private web dashboard for the sing-box API managed by
Shinra.

It is not a general-purpose Clash or multi-backend dashboard. The Dashboard
always connects to the sing-box API that serves the current page, so browsers
never store or ask for an API host, port, protocol, backend type, or secret.

## Runtime model

```text
Browser → /dashboard/ on Shinra's sing-box API → same-origin gRPC-Web API
```

Direct LAN access is the default and must remain stable:

```text
http://<router-address>:20123/dashboard/
```

Public reverse-proxy access is an optional enhancement. Shinra decides when to
open the public Dashboard path, and passes a same-origin `api` path such as
`/shinra/api/`. The Dashboard uses that one base path for gRPC-Web and
WebSocket traffic. It does not discover, configure or manage NPS; NPS domain,
TLS, path rewrites, WebSocket forwarding and access control remain on the NPS
server.

Shinra owns the API listener and Dashboard download URL. Browser storage is
used only for personal interface preferences such as theme, language and layout.

## Release

`dev` is the integration branch and `main` is the verified source branch.
Ordinary verification builds are not Releases. Create and push a version tag
such as `v0.1.0`, or run the **Release Shinra Dashboard** workflow manually
from GitHub Actions. Only that workflow publishes a Release asset named
`shinra-dashboard.zip`.

Configure Shinra to download:

```text
https://github.com/miozen/shinra-dashboard/releases/latest/download/shinra-dashboard.zip
```

The ZIP contains the contents of `dist/` at its root, ready for the sing-box
API service to serve at `/dashboard/`.

## Maintainer constraints

Do not change the following without an approved impact analysis:

- Direct LAN operation remains the default; public reverse-proxy paths are
  opt-in and must not break LAN access.
- Dashboard REST/gRPC and WebSocket use the same same-origin API base path.
- NPS remains external infrastructure rather than a Dashboard-managed feature.
- Branch verification must not replace tag-triggered Release publishing or
  rename the stable `shinra-dashboard.zip` asset.

## Supported dashboard features

- Proxy groups, selection and latency tests
- Connections and connection history
- Logs, traffic and overview charts
- Interface theme, language, layout and other local display preferences

The rules page is intentionally removed. The native sing-box API does not
expose a complete rules-list endpoint.
