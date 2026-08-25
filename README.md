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

This works for direct LAN access and for a reverse proxy, provided the proxy
forwards the Dashboard API and its WebSocket traffic.

Shinra owns the API listener and Dashboard download URL. Browser storage is
used only for personal interface preferences such as theme, language and layout.

## Release

Create and push a version tag such as `v0.1.0`, or run the **Release Shinra
Dashboard** workflow manually from GitHub Actions. The workflow installs the
locked dependencies, type-checks, builds the Vite application, and publishes a
Release asset named `shinra-dashboard.zip`.

Configure Shinra to download:

```text
https://github.com/miozen/shinra-dashboard/releases/latest/download/shinra-dashboard.zip
```

The ZIP contains the contents of `dist/` at its root, ready for the sing-box
API service to serve at `/dashboard/`.

## Supported dashboard features

- Proxy groups, selection and latency tests
- Connections and connection history
- Logs, traffic and overview charts
- Interface theme, language, layout and other local display preferences

The rules page is intentionally removed. The native sing-box API used by this
Dashboard does not expose the Clash rules-list data expected by Zashboard 3.22.
