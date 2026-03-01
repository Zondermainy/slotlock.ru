<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="login-logo">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" fill="url(#regGrad)"/>
            <path d="M20 32L28 24L36 32L28 40L20 32Z" fill="white"/>
            <path d="M36 24L44 32L36 40L28 32L36 24Z" fill="white" fill-opacity="0.7"/>
            <defs>
              <linearGradient id="regGrad" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stop-color="#1565C0"/>
                <stop offset="100%" stop-color="#42A5F5"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="login-title">{{ t('register') }}</h1>
        <p class="login-subtitle">{{ t('createAccount') }}</p>
      </div>

      <n-card class="login-card">
        <n-form ref="formRef" :model="formData" :rules="rules">
          <n-form-item :label="t('fullName')" path="name">
            <n-input 
              v-model:value="formData.name" 
              :placeholder="t('enterName')"
            />
          </n-form-item>
          <n-form-item :label="t('email')" path="email">
            <n-input 
              v-model:value="formData.email" 
              :placeholder="'student@dvfu.ru'"
              @blur="validateEmailDomain"
            />
          </n-form-item>
          <n-form-item :label="t('password')" path="password">
            <n-input 
              v-model:value="formData.password" 
              type="password"
              :placeholder="t('min8chars')"
              show-password-on="click"
            />
          </n-form-item>
          <n-form-item :label="t('confirmPassword')" path="confirmPassword">
            <n-input 
              v-model:value="formData.confirmPassword" 
              type="password"
              :placeholder="t('repeatPassword')"
              show-password-on="click"
              @keyup.enter="handleRegister"
            />
          </n-form-item>
          <n-alert v-if="errorMessage" type="error" class="error-alert">
            {{ errorMessage }}
          </n-alert>
          <n-alert v-if="successMessage" type="success" class="error-alert">
            {{ successMessage }}
          </n-alert>
          <n-button
            type="primary"
            block
            class="login-btn"
            :loading="loading"
            :disabled="!isFormValid"
            @click="handleRegister"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 21V19C19.9993 18.1137 19.7044 17.2528 19.1614 16.5523C18.6184 15.8519 17.8581 15.3516 17 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </template>
            {{ t('register') }}
          </n-button>
        </n-form>
        <template #footer>
          <div class="login-footer">
            <n-text depth="2">{{ t('hasAccount') }}</n-text>
            <NuxtLink to="/login" class="register-link">
              {{ t('login') }}
            </NuxtLink>
          </div>
        </template>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NButton, NText, NAlert } from 'naive-ui'
import { useI18n } from '~/composables/useI18n'

const router = useRouter()
const { t } = useI18n()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const validateEmailDomain = () => {
  if (formData.value.email && !formData.value.email.toLowerCase().endsWith('@dvfu.ru')) {
    errorMessage.value = t('emailMustBeDvfu')
  } else {
    errorMessage.value = ''
  }
}

const validatePasswordMatch = (rule: any, value: string) => {
  if (value !== formData.value.password) {
    return new Error(t('passwordsNotMatch'))
  }
  return true
}

const rules = {
  name: {
    required: true,
    message: t('enterName'),
    trigger: 'blur'
  },
  email: [
    {
      required: true,
      message: t('enterEmail'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string) => {
        if (value && !value.toLowerCase().endsWith('@dvfu.ru')) {
          return new Error(t('emailMustBeDvfu'))
        }
        return true
      },
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('enterPassword'),
      trigger: 'blur'
    },
    {
      min: 8,
      message: t('min8chars'),
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: t('repeatPassword'),
      trigger: 'blur'
    },
    {
      validator: validatePasswordMatch,
      trigger: 'blur'
    }
  ]
}

const isFormValid = computed(() => {
  return formData.value.name && 
    formData.value.email && 
    formData.value.email.toLowerCase().endsWith('@dvfu.ru') &&
    formData.value.password.length >= 8 &&
    formData.value.password === formData.value.confirmPassword
})

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!isFormValid.value) return
  
  loading.value = true
  
  try {
    await $fetch('/api/register', {
      method: 'POST',
      body: {
        email: formData.value.email,
        password: formData.value.password,
        name: formData.value.name
      }
    })
    
    successMessage.value = t('registrationSuccess')
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error: any) {
    errorMessage.value = error.data?.message || t('registrationError')
  } finally {
    loading.value = false
  }
}
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
