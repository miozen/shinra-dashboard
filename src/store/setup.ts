import type { Backend } from '@/types'
import { computed, ref } from 'vue'

// The Dashboard normally connects to the API that serves this page. Shinra can
// pass a same-origin `api` path when a reverse proxy exposes Dashboard and API
// beneath different public paths. Do not accept a cross-origin API override:
// that would turn a public dashboard URL into an unexpected browser proxy.
function resolveApiEndpoint() {
  const query = new URLSearchParams(window.location.search)
  const requestedPath = query.get('api')

  if (!requestedPath || requestedPath.charAt(0) !== '/') {
    return new URL(window.location.origin)
  }

  const endpoint = new URL(requestedPath, window.location.origin)
  return endpoint.origin === window.location.origin ? endpoint : new URL(window.location.origin)
}

const apiEndpoint = resolveApiEndpoint()
const apiPath = apiEndpoint.pathname.replace(/\/$/, '')

export const shinraEndpoint: Backend = {
  type: 'singbox',
  protocol: apiEndpoint.protocol.replace(':', ''),
  host: apiEndpoint.hostname,
  port: apiEndpoint.port || (apiEndpoint.protocol === 'https:' ? '443' : '80'),
  secondaryPath: apiPath,
  password: '',
  uuid: 'shinra',
  label: 'Shinra',
}

export const activeUuid = computed(() => shinraEndpoint.uuid)
export const activeBackend = computed(() => shinraEndpoint)

// Compatibility for source-IP label scope migration. It contains exactly one
// immutable endpoint and is never persisted or displayed as a backend list.
export const backendList = ref<Backend[]>([shinraEndpoint])
