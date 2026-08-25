<template>
  <div class="relative flex flex-col text-sm">
    <div class="flex items-center gap-2 px-1">
      <a
        href="https://github.com/miozen/shinra-dashboard"
        target="_blank"
        rel="noreferrer"
        class="text-lg font-semibold"
      >
        Shinra Dashboard
        <span class="text-sm font-normal opacity-50">
          {{ dashboardVersion }}
          <span
            v-if="commitId"
            class="text-xs"
          >
            {{ commitId }}
          </span>
        </span>
      </a>
    </div>

    <StyleSettings />
    <GeneralSettings />
  </div>
</template>

<script setup lang="ts">
import { dashboardVersion } from '@/assembly/version'
import GeneralSettings from './GeneralSettings.vue'
import StyleSettings from './StyleSettings.vue'

const commitId = __COMMIT_ID__
</script>
