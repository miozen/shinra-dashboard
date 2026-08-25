import type { ProbeResult } from '@/helper/connectivity'
import { activeBackend } from '@/store/setup'
import type { Backend } from '@/types'
import { computed, ref } from 'vue'

const USBIP_MIN_API_VERSION = 2
const OPENVPN_MIN_API_VERSION = 3
const TAILDROP_MIN_API_VERSION = 4

export enum Channel {
  Clash = 'clash',
  Singbox = 'singbox',
}

export enum Core {
  Mihomo = 'mihomo',
  Singbox = 'singbox',
  Honk = 'honk',
  Unknown = 'unknown',
}

export const channel = computed(() => Channel.Singbox)
export const core = ref<Core>(Core.Unknown)
export const apiVersion = ref(0)
export const resetCore = () => {
  core.value = Core.Unknown
  apiVersion.value = 0
}

export const showDisplayAllFeatures = computed(() => false)

export type Cap =
  | 'singboxDeprecationNotice'
  | 'rules'
  | 'dnsQuery'
  | 'dnsFlush'
  | 'fakeIPFlush'
  | 'coreActions'
  | 'dashboardUpgrade'
  | 'tools'
  | 'goroutines'
  | 'startedAt'
  | 'usbip'
  | 'openvpn'
  | 'taildrop'
  | 'coreUpgrade'
  | 'coreRestart'
  | 'reloadConfigs'
  | 'updateConfigs'
  | 'updateGeoDatabase'
  | 'syncSettings'
  | 'independentLatency'
  | 'coreUpdateCheck'
  | 'configPatch'
  | 'customGlobalNode'
  | 'logTypeFilter'
  | 'logConnectionDetail'
  | 'disconnectOnModeChange'
  | 'traceLogLevel'
  | 'extraLogLevels'
  | 'silentLogLevel'

export const can = (cap: Cap): boolean => {
  if (!activeBackend.value) return false
  switch (cap) {
    case 'tools':
    case 'goroutines':
    case 'startedAt':
    case 'customGlobalNode':
    case 'logTypeFilter':
    case 'logConnectionDetail':
    case 'disconnectOnModeChange':
    case 'traceLogLevel':
    case 'extraLogLevels':
    case 'silentLogLevel':
      return true
    case 'usbip':
      return apiVersion.value >= USBIP_MIN_API_VERSION
    case 'openvpn':
      return apiVersion.value >= OPENVPN_MIN_API_VERSION
    case 'taildrop':
      return apiVersion.value >= TAILDROP_MIN_API_VERSION
    default:
      return false
  }
}

export const probeBackend = async (
  backend: Backend,
  timeout = 10000,
  signal?: AbortSignal,
): Promise<ProbeResult> => {
  const { probeSingboxChannel } = await import('@/api/singbox/client')
  return probeSingboxChannel(backend, timeout, signal)
}

export const isBackendAvailable = (backend: Backend, timeout = 10000) =>
  probeBackend(backend, timeout).then((result) => result.ok)
