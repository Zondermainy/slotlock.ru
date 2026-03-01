<template>
  <n-config-provider :locale="isRu ? ruRU : enUS" :date-locale="isRu ? ruRU : enUS" :theme="darkTheme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { ruRU, enUS, darkTheme } from 'naive-ui'
import { useI18n } from '~/composables/useI18n'

const { isRu } = useI18n()
</script>
