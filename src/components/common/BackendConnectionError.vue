<template>
  <Transition name="connection-error">
    <div
      v-if="failed"
      class="bg-base-200/80 fixed inset-0 z-[100000] flex items-center justify-center overflow-auto p-4 backdrop-blur-sm"
    >
      <div class="border-base-border bg-base-100 flex w-96 max-w-full flex-col gap-3 rounded-xl border px-6 py-5 shadow-lg">
        <div class="flex items-start gap-3">
          <span class="bg-error/10 text-error flex h-10 w-10 flex-none items-center justify-center rounded-lg">
            <ExclamationTriangleIcon class="h-5 w-5" />
          </span>
          <div class="min-w-0 flex-1">
            <h1 class="text-base font-medium">{{ $t('backendUnreachable') }}</h1>
            <div class="text-base-content/60 text-sm">Shinra sing-box API</div>
          </div>
        </div>
        <div class="bg-error/10 text-error rounded-lg px-3 py-2 text-xs leading-5 break-all">
          {{ detail || $t('backendConnectionFailed') }}
        </div>
        <p class="text-base-content/60 text-xs leading-5">
          请在 Shinra 的面板管理中检查 sing-box API 是否已启用、服务是否正在运行，以及反向代理是否转发了 Dashboard API。
        </p>
        <button class="btn btn-primary btn-sm" :disabled="retrying" @click="retry">
          <span v-if="retrying" class="loading loading-spinner loading-xs"></span>
          {{ retrying ? $t('backendConnecting') : $t('retry') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { startBackendSession } from '@/assembly/session'
import { backendProbe } from '@/assembly/version'
import { describeConnectionError } from '@/helper/connectivity'
import { activeBackend } from '@/store/setup'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { computed, ref, watch } from 'vue'

const failed = ref(false)
const detail = ref('')
const retrying = computed(() => backendProbe.value?.status === 'probing')

watch(
  () => backendProbe.value?.status,
  async (status) => {
    failed.value = status === 'failed'
    if (status !== 'failed') {
      detail.value = ''
      return
    }
    detail.value = await describeConnectionError(
      backendProbe.value?.message || '',
      `${activeBackend.value.protocol}://${activeBackend.value.host}:${activeBackend.value.port}`,
    )
  },
  { immediate: true },
)

const retry = () => startBackendSession()
</script>

<style scoped>
.connection-error-enter-active,
.connection-error-leave-active { transition: opacity 0.2s ease; }
.connection-error-enter-from,
.connection-error-leave-to { opacity: 0; }
</style>
