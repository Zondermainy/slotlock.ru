<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <div class="app-container">
          <n-layout header style="min-height: 100vh">
            <n-layout-header bordered class="header">
              <div class="header-content">
                <NuxtLink to="/" class="logo">
                  <div class="logo-container">
                    <div class="logo-icon">
                      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#1E88E5"/>
                        <path d="M12 20L18 14L24 20L18 26L12 20Z" fill="white"/>
                        <path d="M24 14L30 20L24 26L18 20L24 14Z" fill="white" fill-opacity="0.7"/>
                      </svg>
                    </div>
                    <div class="logo-text">
                      <span class="logo-dvfu">ДВФУ</span>
                      <span class="logo-slotlock">Бронирование</span>
                    </div>
                  </div>
                </NuxtLink>
                <div class="header-actions">
                  <template v-if="auth.isLoggedIn">
                    <n-text class="user-name">{{ auth.userName }}</n-text>
                    <n-tag v-if="auth.isAdmin" type="warning" size="small">Админ</n-tag>
                    <NuxtLink v-if="auth.isAdmin" to="/admin">
                      <n-button quaternary>Админка</n-button>
                    </NuxtLink>
                    <n-button quaternary @click="auth.logout">Выйти</n-button>
                  </template>
                  <template v-else>
                    <NuxtLink to="/login">
                      <n-button type="primary">Войти</n-button>
                    </NuxtLink>
                  </template>
                </div>
              </div>
            </n-layout-header>
            <n-layout-content class="main-content">
              <slot />
            </n-layout-content>
          </n-layout>
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutContent, NButton, NText, NTag, NMessageProvider, NDialogProvider } from 'naive-ui'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const themeOverrides = {
  common: {
    primaryColor: '#1E88E5',
    primaryColorHover: '#42A5F5',
    primaryColorPressed: '#1565C0',
    borderRadius: '8px'
  },
  Button: {
    borderRadiusMedium: '8px'
  },
  Card: {
    borderRadius: '12px'
  }
}

onMounted(() => {
  auth.restoreSession()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #f5f9ff 0%, #e3f2fd 100%);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f9ff 0%, #e3f2fd 100%);
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #1565C0 0%, #1E88E5 100%);
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(30, 136, 229, 0.15);
}

.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: white;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-dvfu {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
}

.logo-slotlock {
  font-size: 12px;
  opacity: 0.85;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  color: white !important;
  font-weight: 500;
}

.header :deep(.n-button) {
  color: white;
}

.header :deep(.n-button:hover) {
  background: rgba(255, 255, 255, 0.15);
}

.main-content {
  padding: 32px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.n-card {
  background: white;
  box-shadow: 0 2px 12px rgba(30, 136, 229, 0.08);
  border: 1px solid rgba(30, 136, 229, 0.1);
}

.n-card:hover {
  box-shadow: 0 4px 20px rgba(30, 136, 229, 0.12);
}
</style>
