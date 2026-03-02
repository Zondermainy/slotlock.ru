<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <div class="app-container">
          <n-layout style="min-height: 100vh; display: flex; flex-direction: column">
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
                      <span class="logo-dvfu">slotlock</span>
                      <span class="logo-slotlock">{{ isRu ? 'ДВФУ' : 'FEFU' }}</span>
                    </div>
                  </div>
                </NuxtLink>
                
                <n-button quaternary circle @click="showMenu = !showMenu" class="menu-btn">
                  <template #icon>
                    <svg v-if="!showMenu" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </template>
                </n-button>
              </div>

              <div v-if="showMenu" class="menu-dropdown">
                <div class="menu-section">
                  <n-button quaternary @click="toggleTheme">
                    <template #icon>
                      <svg v-if="isDark" viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </template>
                    {{ isRu ? 'Светлая тема' : 'Light theme' }}
                  </n-button>
                  <n-button quaternary @click="toggleLang">
                    {{ isRu ? 'Английский' : 'Русский' }}
                  </n-button>
                </div>
                
                <div v-if="auth.isLoggedIn" class="menu-section">
                  <div class="menu-user">{{ auth.userName }}</div>
                  <NuxtLink to="/my-bookings" @click="showMenu = false">
                    <n-button quaternary class="menu-btn-full">{{ t('myBookings') }}</n-button>
                  </NuxtLink>
                  <NuxtLink v-if="auth.isAdmin" to="/admin" @click="showMenu = false">
                    <n-button quaternary class="menu-btn-full">{{ t('adminPanel') }}</n-button>
                  </NuxtLink>
                  <n-button quaternary type="error" @click="handleLogout(); showMenu = false">{{ t('logout') }}</n-button>
                </div>
                
                <div v-else class="menu-section">
                  <NuxtLink to="/login" @click="showMenu = false">
                    <n-button type="primary" class="menu-btn-full">{{ t('login') }}</n-button>
                  </NuxtLink>
                </div>
              </div>
            </n-layout-header>
            <n-layout-content class="main-content">
              <slot />
            </n-layout-content>
            <footer class="footer">
              <div class="footer-content">
                <div class="footer-project">
                  <span class="footer-name">slotlock</span>
                  <span class="footer-dvfu">{{ isRu ? 'ДВФУ' : 'FEFU' }}</span>
                </div>
                <div class="footer-group">Б9122-09.03.02прс</div>
                <div class="footer-edu">{{ isRu ? 'Учебный проект' : 'Educational project' }}</div>
                <div class="footer-links">
                  <a href="https://github.com/Zondermainy/slotlock.ru" target="_blank" class="github-link">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </footer>
          </n-layout>
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider, NLayout, NLayoutHeader, NLayoutContent, NButton, NText, useThemeVars } from 'naive-ui'
import { useAuthStore } from '~/stores/auth'
import { useI18n } from '~/composables/useI18n'

const auth = useAuthStore()
const { t, isRu, toggleLang } = useI18n()
const router = useRouter()

const theme = ref(null)
const showMenu = ref(false)
const isDark = ref(false)

const themeOverrides = {
  common: {
    primaryColor: '#1E88E5',
    primaryColorHover: '#1565C0',
    primaryColorPressed: '#0D47A1'
  }
}

const updateBodyClass = () => {
  if (import.meta.client) {
    document.body.classList.toggle('dark', isDark.value)
  }
}

watch(isDark, updateBodyClass, { immediate: true })

const toggleTheme = () => {
  isDark.value = !isDark.value
  updateBodyClass()
  if (import.meta.client) {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
}

if (import.meta.client) {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
    updateBodyClass()
  }
}

const handleLogout = () => {
  auth.logout()
  router.push('/')
}

const container = document.querySelector('.app-container')
if (container) {
  container.classList.toggle('dark', isDark.value)
}
</script>

<style>
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

.app-container.dark {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.header {
  background: linear-gradient(135deg, #1565C0 0%, #1E88E5 100%);
  padding: 0 24px;
  height: 72px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header.dark {
  background: linear-gradient(135deg, #0d47a1 0%, #1565C0 100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo {
  text-decoration: none;
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

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-dvfu {
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.logo-slotlock {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.menu-btn {
  color: white !important;
}

.menu-dropdown {
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1565C0 0%, #1E88E5 100%);
  padding: 16px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.menu-section:last-child {
  border-bottom: none;
}

.menu-user {
  color: white;
  font-weight: 600;
  padding: 8px 0;
}

.menu-btn-full {
  width: 100%;
  justify-content: flex-start;
  color: white !important;
}

.menu-btn-full:hover {
  background: rgba(255,255,255,0.1) !important;
}

.main-content {
  padding: 32px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background: linear-gradient(135deg, #1565C0 0%, #1E88E5 100%);
  padding: 24px;
  margin-top: auto;
}

.dark .footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-project {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.footer-dvfu {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-group {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.footer-edu {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.footer-links {
  display: flex;
  align-items: center;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.github-link:hover {
  color: white;
}
</style>
