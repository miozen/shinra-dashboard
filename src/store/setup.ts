import type { Backend } from '@/types'
import { computed, ref } from 'vue'

// Shinra Dashboard always connects to the sing-box API that serves this page.
// This compatibility-shaped value remains internal so the established gRPC
// modules can share one endpoint without any browser-side API configuration.
const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80')

export const shinraEndpoint: Backend = {
  type: 'singbox',
  protocol: window.location.protocol.replace(':', ''),
  host: window.location.hostname,
  port,
  secondaryPath: '',
  password: '',
  uuid: 'shinra',
  label: 'Shinra',
}

export const activeUuid = computed(() => shinraEndpoint.uuid)
export const activeBackend = computed(() => shinraEndpoint)

// Compatibility for source-IP label scope migration. It contains exactly one
// immutable endpoint and is never persisted or displayed as a backend list.
export const backendList = ref<Backend[]>([shinraEndpoint])
