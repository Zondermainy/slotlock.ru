<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="login-logo">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" fill="url(#loginGrad)"/>
            <path d="M20 32L28 24L36 32L28 40L20 32Z" fill="white"/>
            <path d="M36 24L44 32L36 40L28 32L36 24Z" fill="white" fill-opacity="0.7"/>
            <defs>
              <linearGradient id="loginGrad" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stop-color="#1565C0"/>
                <stop offset="100%" stop-color="#42A5F5"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="login-title">{{ t('welcome') }}</h1>
        <p class="login-subtitle">{{ t('bookingTitle') }}</p>
      </div>

      <n-card class="login-card">
        <n-form ref="formRef" :model="formData" :rules="rules">
          <n-form-item :label="t('email')" path="email">
            <n-input 
              v-model:value="formData.email" 
              :placeholder="'example@dvfu.ru'"
              @keyup.enter="handleLogin"
            />
          </n-form-item>
          <n-form-item :label="t('password')" path="password">
            <n-input 
              v-model:value="formData.password" 
              type="password"
              :placeholder="t('enterPassword')"
              show-password-on="click"
              @keyup.enter="handleLogin"
            />
          </n-form-item>
          <n-alert v-if="errorMessage" type="error" class="error-alert">
            {{ errorMessage }}
          </n-alert>
          <n-button
            type="primary"
            block
            class="login-btn"
            :loading="loading"
            :disabled="!formData.email || !formData.password"
            @click="handleLogin"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </template>
            {{ t('login') }}
          </n-button>
        </n-form>
        <template #footer>
          <div class="login-footer">
            <n-text depth="2">{{ t('noAccount') }}</n-text>
            <NuxtLink to="/register" class="register-link">
              {{ t('register') }}
            </NuxtLink>
          </div>
        </template>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NButton, NText, NAlert } from 'naive-ui'
import { useAuthStore } from '~/stores/auth'
import { useI18n } from '~/composables/useI18n'

const auth = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const formData = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const rules = {
  email: {
    required: true,
    message: t('enterEmail'),
    trigger: 'blur'
  },
  password: {
    required: true,
    message: t('enterPassword'),
    trigger: 'blur'
  }
}

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  
  try {
    await auth.login(formData.value.email, formData.value.password)
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.data?.message || t('loginError')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (auth.isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.login-logo svg {
  width: 100%;
  height: 100%;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1565C0;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 15px;
  color: #546E7A;
}

.login-card {
  border-radius: 16px !important;
}

.login-card :deep(.n-card-header) {
  padding-bottom: 8px;
}

.login-card :deep(.n-card-header__main) {
  font-size: 18px;
  font-weight: 600;
  color: #1565C0;
}

.login-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%) !important;
  border: none !important;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565C0 0%, #1E88E5 100%) !important;
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.register-link {
  color: #1E88E5;
  font-weight: 600;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

.error-alert {
  margin-bottom: 16px;
}

.dark .login-title {
  color: #64b5f6;
}

.dark .login-subtitle {
  color: #a0a0a0;
}
</style>
