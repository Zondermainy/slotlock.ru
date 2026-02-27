<template>
  <div class="admin-page">
    <NuxtLink to="/" class="back-link">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="back-icon">
        <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      На главную
    </NuxtLink>

    <div class="admin-header">
      <div class="admin-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="white" stroke-width="2"/>
          <path d="M12 15V18" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 21V18" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div>
        <n-h1 class="admin-title">Админ-панель</n-h1>
        <n-text depth="2">Управление бронированиями и комнатами</n-text>
      </div>
    </div>

    <n-card class="admin-card">
      <template #header>
        <div class="card-header">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="card-icon">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#1E88E5" stroke-width="2"/>
            <path d="M16 2V6" stroke="#1E88E5" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 2V6" stroke="#1E88E5" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 10H21" stroke="#1E88E5" stroke-width="2"/>
          </svg>
          <span class="card-title">Все бронирования</span>
        </div>
      </template>
      <n-data-table
        :columns="columns"
        :data="bookings"
        :row-key="(row: any) => row.id"
        :bordered="false"
        class="bookings-table"
      />
    </n-card>

    <n-card class="admin-card" style="margin-top: 24px">
      <template #header>
        <div class="card-header">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="card-icon">
            <path d="M3 21V7L12 3L21 7V21" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 21V13H15V21" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="card-title">Добавить комнату</span>
        </div>
      </template>
      <n-form ref="formRef" :model="newRoom">
        <n-grid :cols="2" :x-gap="16" :y-gap="8">
          <n-gi>
            <n-form-item label="Название" label-placement="left">
              <n-input v-model:value="newRoom.name" placeholder="Коворкинг 'У окна'" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="ID" label-placement="left">
              <n-input v-model:value="newRoom.id" placeholder="a11-05" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Вместимость" label-placement="left">
              <n-input-number v-model:value="newRoom.capacity" :min="1" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Удобства" label-placement="left">
              <n-input v-model:value="newRoom.amenities" placeholder="Розетки, Wi-Fi" />
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-button type="primary" class="add-btn" @click="addRoom">
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          Добавить комнату
        </n-button>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NH1, NDataTable, NButton, NForm, NFormItem, NInput, NInputNumber, NGrid, NGi, NTag, useMessage, NText } from 'naive-ui'
import { useAuthStore } from '~/stores/auth'

interface Booking {
  id: string
  roomId: string
  userId: number
  userName: string
  title: string
  date: string
  startTime: string
  endTime: string
  status: string
}

const auth = useAuthStore()
const router = useRouter()
const message = useMessage()

const bookings = ref<Booking[]>([])
const newRoom = ref({
  id: '',
  name: '',
  capacity: 4,
  amenities: ''
})

const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 140
  },
  {
    title: 'Комната',
    key: 'roomId',
    width: 100
  },
  {
    title: 'Пользователь',
    key: 'userName'
  },
  {
    title: 'Название',
    key: 'title'
  },
  {
    title: 'Дата',
    key: 'date',
    width: 120
  },
  {
    title: 'Время',
    key: 'startTime',
    width: 120,
    render: (row: Booking) => `${row.startTime}:00 - ${row.endTime}:00`
  },
  {
    title: 'Статус',
    key: 'status',
    width: 120,
    render: (row: Booking) => h(NTag, { type: row.status === 'confirmed' ? 'success' : 'warning', size: 'small' }, () => row.status)
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 100,
    render: (row: Booking) => h(NButton, { size: 'small', type: 'error', onClick: () => deleteBooking(row.id) }, () => 'Удалить')
  }
]

const deleteBooking = async (id: string) => {
  try {
    await $fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    message.success('Бронирование удалено')
    await loadBookings()
  } catch (error) {
    message.error('Ошибка при удалении')
  }
}

const addRoom = async () => {
  if (!newRoom.value.id || !newRoom.value.name) {
    message.warning('Заполните название и ID')
    return
  }

  try {
    const amenities = newRoom.value.amenities.split(',').map(s => s.trim()).filter(Boolean)
    
    await $fetch('/api/rooms', {
      method: 'POST',
      body: {
        id: newRoom.value.id,
        name: newRoom.value.name,
        capacity: newRoom.value.capacity,
        amenities
      }
    })

    message.success('Комната добавлена')
    newRoom.value = { id: '', name: '', capacity: 4, amenities: '' }
  } catch (error: any) {
    message.error(error.data?.message || 'Ошибка при добавлении комнаты')
  }
}

const loadBookings = async () => {
  bookings.value = await $fetch<Booking[]>('/api/bookings')
}

onMounted(async () => {
  if (!auth.isLoggedIn || !auth.isAdmin) {
    router.push('/')
    return
  }
  await loadBookings()
})
</script>

<style scoped>
.admin-page {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: #1E88E5;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.back-link:hover {
  color: #1565C0;
  transform: translateX(-4px);
}

.back-icon {
  width: 20px;
  height: 20px;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.admin-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.admin-icon svg {
  width: 100%;
  height: 100%;
}

.admin-title {
  color: #1565C0 !important;
  margin-bottom: 4px !important;
}

.admin-card {
  border-radius: 16px !important;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 24px;
  height: 24px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1565C0;
}

.add-btn {
  height: 44px;
  font-weight: 600;
  background: linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%) !important;
  border: none !important;
  margin-top: 8px;
}

.add-btn:hover {
  background: linear-gradient(135deg, #1565C0 0%, #1E88E5 100%) !important;
}

.bookings-table :deep(.n-data-table-th) {
  background: #FAFDFF !important;
}

.bookings-table :deep(.n-data-table-td) {
  font-size: 14px;
}
</style>
