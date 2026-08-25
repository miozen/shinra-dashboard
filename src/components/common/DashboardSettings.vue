<template>
  <button
    class="btn btn-sm"
    @click="dashboardSettingsDialogShow = true"
  >
    <Cog6ToothIcon
      v-if="iconOnly"
      class="h-4 w-4"
    />
    <template v-else>{{ $t('dashboardSettings') }}</template>
  </button>
  <DialogWrapper
    v-model="dashboardSettingsDialogShow"
    :title="$t('dashboardSettings')"
  >
    <template #title-right>
      <button
        class="btn btn-xs absolute top-2 right-10"
        @click="handlerClickResetSettings"
      >
        {{ $t('resetSettings') }}
      </button>
    </template>
    <div class="settings-section-label">
      {{ $t('dashboardSettingsJsonFile') }}
    </div>
    <div class="settings-grid">
      <div class="setting-item">
        <div class="setting-item-label">
          {{ $t('exportSettings') }}
        </div>
        <button
          class="btn btn-sm"
          @click="exportSettings"
        >
          <ArrowDownCircleIcon class="h-4 w-4" />
        </button>
      </div>
      <div class="setting-item">
        <div class="setting-item-label">
          {{ $t('importFromFile') }}
        </div>
        <button
          class="btn btn-sm"
          @click="importSettingsFromFile"
        >
          <ArrowUpCircleIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="settings-section-label">
      {{ $t('dashboardSettingsUrl') }}
    </div>
    <div class="settings-grid">
      <div class="setting-item max-sm:flex-col max-sm:items-start! max-sm:py-3">
        <div class="setting-item-label shrink-0!">
          {{ $t('importFromUrl') }}
        </div>
        <div class="flex items-center gap-2 max-sm:flex-wrap">
          <div class="join flex-1">
            <TextInput
              v-model="importSettingsUrl"
              class="join-item max-w-none flex-1"
            />
            <button
              class="btn btn-sm join-item"
              @click="importSettingsFromUrlHandler()"
            >
              <ArrowDownTrayIcon class="h-4 w-4" />
            </button>
          </div>
          <QuestionMarkCircleIcon
            v-if="importSettingsUrl === DEFAULT_SETTINGS_URL"
            class="h-4 w-4 shrink-0"
            @mouseenter="
              showTip($event, $t('importFromBackendTip'), {
                appendTo: 'parent',
              })
            "
          />
          <button
            v-else
            class="btn btn-sm"
            @click="importSettingsUrl = DEFAULT_SETTINGS_URL"
          >
            {{ $t('reset') }}
          </button>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-item-label flex items-center gap-2">
          {{ $t('autoImportFromUrl') }}
          <QuestionMarkCircleIcon
            class="h-4 w-4 cursor-pointer"
            @mouseenter="
              showTip($event, $t('autoImportFromUrlTip'), {
                appendTo: 'parent',
              })
            "
          />
        </div>
        <input
          v-model="autoImportSettings"
          type="checkbox"
          class="toggle"
        />
      </div>
      <div
        v-if="autoImportSettings || skipImportSettingsConfirm"
        class="setting-item"
      >
        <div class="setting-item-label">
          {{ $t('confirmBeforeOverride') }}
        </div>
        <input
          v-model="skipImportSettingsConfirm"
          type="checkbox"
          class="toggle"
          :true-value="false"
          :false-value="true"
        />
      </div>
    </div>
    <input
      ref="inputRef"
      type="file"
      accept=".json"
      class="hidden"
      @change="handlerJsonUpload"
    />
  </DialogWrapper>
</template>

<script setup lang="ts">
import {
  autoImportSettings,
  DEFAULT_SETTINGS_URL,
  importSettingsFromUrl,
  importSettingsUrl,
  skipImportSettingsConfirm,
} from '@/helper/autoImportSettings'
import { showNotification } from '@/helper/notification'
import { useTooltip } from '@/helper/tooltip'
import {
  applyDashboardSettingsToStorage,
  exportSettings,
  resetSettings,
} from '@/helper/utils'
import {
  ArrowDownCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DialogWrapper from './DialogWrapper.vue'
import TextInput from './TextInput.vue'

withDefaults(
  defineProps<{
    /** 仅显示图标的触发按钮，用于左侧已有文字标签的设置行 */
    iconOnly?: boolean
  }>(),
  { iconOnly: false },
)

const inputRef = ref<HTMLInputElement>()
const dashboardSettingsDialogShow = ref(false)

const { showTip } = useTooltip()
const { t } = useI18n()

const handlerClickResetSettings = () => {
  if (!window.confirm(t('resetSettingsConfirm'))) return
  dashboardSettingsDialogShow.value = false
  resetSettings()
}

const handlerJsonUpload = () => {
  showNotification({
    content: 'importing',
  })
  const file = inputRef.value?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    const settings = JSON.parse(reader.result as string)
    applyDashboardSettingsToStorage(settings)
    location.reload()
  }
  reader.readAsText(file)
}

const importSettingsFromFile = () => {
  inputRef.value?.click()
}
const importSettingsFromUrlHandler = async () => {
  dashboardSettingsDialogShow.value = false
  await importSettingsFromUrl({ force: true })
}

</script>
