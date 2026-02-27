<template>
  <div class="admin-page">
    <NuxtLink to="/" class="back-link">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="back-icon">
        <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {{ t('backToList') }}
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
        <n-h1 class="admin-title">{{ t('adminPanel') }}</n-h1>
        <n-text depth="2">{{ t('bookings') }}</n-text>
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
          <span class="card-title">{{ t('bookings') }}</span>
        </div>
      </template>
      <n-data-table
        :columns="bookingColumns"
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
          <span class="card-title">{{ t('rooms') }}</span>
        </div>
      </template>
      
      <n-tabs type="segment">
        <n-tab-pane name="rooms" :tab="t('rooms')">
          <n-data-table
            :columns="roomColumns"
            :data="rooms"
            :row-key="(row: any) => row.id"
            :bordered="false"
            class="rooms-table"
            style="margin-top: 16px"
          />
        </n-tab-pane>
        
        <n-tab-pane name="addRoom" :tab="t('addRoom')">
          <n-form ref="formRef" :model="newRoom" style="margin-top: 16px">
            <n-grid :cols="2" :x-gap="16" :y-gap="8">
              <n-gi :span="2">
                <n-form-item :label="t('building')">
                  <n-select v-model:value="newRoom.building" :options="buildingSelectOptions" :placeholder="t('buildingRequired')" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('floor')">
                  <n-select v-model:value="newRoom.floor" :options="floorOptionsForBuilding" :placeholder="t('floor')" :disabled="!newRoom.building" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('roomType')">
                  <n-select v-model:value="newRoom.type" :options="roomTypes" />
                </n-form-item>
              </n-gi>
              <n-gi :span="2">
                <n-form-item :label="t('roomName')">
                  <n-input v-model:value="newRoom.name" :placeholder="t('roomName')" :maxlength="50" show-count />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('capacity')">
                  <n-input-number v-model:value="newRoom.capacity" :min="1" :max="100" style="width: 100%" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('amenities')">
                  <n-input v-model:value="newRoom.amenities" :placeholder="t('amenitiesHint')" :maxlength="100" show-count />
                </n-form-item>
              </n-gi>
            </n-grid>
            <div style="margin-top: 16px">
              <n-text depth="2">ID будет сгенерирован: <strong>{{ generatedId }}</strong></n-text>
            </div>
            <n-button type="primary" class="add-btn" style="margin-top: 16px" @click="addRoom">
              {{ t('createRoom') }}
            </n-button>
          </n-form>
        </n-tab-pane>
        
        <n-tab-pane name="buildings" :tab="t('buildings')">
          <n-data-table
            :columns="buildingColumns"
            :data="buildings"
            :row-key="(row: any) => row.id"
            :bordered="false"
            class="rooms-table"
            style="margin-top: 16px"
          />
          <n-divider>{{ t('addBuilding') }}</n-divider>
          <n-form :model="newBuilding" style="margin-top: 16px">
            <n-grid :cols="3" :x-gap="16">
              <n-gi>
                <n-form-item :label="t('buildingId')">
                  <n-input v-model:value="newBuilding.id" placeholder="A" :maxlength="2" style="text-transform: uppercase" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('building')">
                  <n-input v-model:value="newBuilding.name" placeholder="Library" :maxlength="30" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('floors')">
                  <n-input-number v-model:value="newBuilding.floors" :min="1" :max="30" />
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-button type="primary" class="add-btn" style="margin-top: 8px" @click="addBuilding">
              {{ t('addBuilding') }}
            </n-button>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NH1, NDataTable, NButton, NForm, NFormItem, NInput, NInputNumber, NGrid, NGi, NTag, useMessage, NText, NTabs, NTabPane, NSelect, NDivider } from 'naive-ui'
import { useAuthStore } from '~/stores/auth'
import { useI18n } from '~/composables/useI18n'

const { t, roomTypes } = useI18n()

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

interface Room {
  id: string
  name: string
  type: string
  building: string
  floor: number
  location: string
  capacity: number
  amenities: string[]
  isActive: boolean
}

interface Building {
  id: string
  name: string
  floors: number
}

const auth = useAuthStore()
const router = useRouter()
const message = useMessage()

const bookings = ref<Booking[]>([])
const rooms = ref<Room[]>([])
const buildings = ref<Building[]>([])
const newRoom = ref({
  building: null as string | null,
  floor: null as number | null,
  type: 'coworking',
  name: '',
  capacity: 4,
  amenities: ''
})
const newBuilding = ref({
  id: '',
  name: '',
  floors: 1
})

const typeOptions = [
  { label: 'Коворкинг', value: 'coworking' },
  { label: 'Переговорная', value: 'meeting' },
  { label: 'Учебная аудитория', value: 'classroom' },
  { label: 'Лаборатория', value: 'lab' },
  { label: 'Конференц-зал', value: 'conference' }
]

const buildingSelectOptions = computed(() => 
  buildings.value.map(b => ({
    label: `${b.id} - ${b.name} (${b.floors} эт.)`,
    value: b.id
  }))
)

const floorOptionsForBuilding = computed(() => {
  if (!newRoom.value.building) return []
  const building = buildings.value.find(b => b.id === newRoom.value.building)
  if (!building) return []
  return Array.from({ length: building.floors }, (_, i) => i + 1).map(f => ({
    label: `${f} этаж`,
    value: f
  }))
})

const generatedId = computed(() => {
  if (!newRoom.value.building || !newRoom.value.floor) return '...'
  const floorStr = newRoom.value.floor.toString().padStart(2, '0')
  const building = newRoom.value.building
  const sameFloorRooms = rooms.value.filter(r => r.building === building && r.floor === newRoom.value.floor)
  const num = (sameFloorRooms.length + 1).toString().padStart(2, '0')
  return `${building}${floorStr}-${num}`
})

const bookingColumns = [
  { title: 'ID', key: 'id', width: 140 },
  { title: 'Комната', key: 'roomId', width: 100 },
  { title: 'Пользователь', key: 'userName' },
  { title: 'Название', key: 'title', ellipsis: { tooltip: true } },
  { title: 'Дата', key: 'date', width: 120 },
  { title: 'Время', key: 'startTime', width: 120, render: (row: Booking) => `${row.startTime}:00 - ${row.endTime}:00` },
  { title: 'Статус', key: 'status', width: 120, render: (row: Booking) => h(NTag, { type: row.status === 'confirmed' ? 'success' : 'warning', size: 'small' }, () => row.status) },
  { title: '', key: 'actions', width: 100, render: (row: Booking) => h(NButton, { size: 'small', type: 'error', onClick: () => deleteBooking(row.id) }, () => 'Удалить') }
]

const roomColumns = [
  { title: 'ID', key: 'id', width: 100 },
  { title: 'Название', key: 'name', ellipsis: { tooltip: true } },
  { title: 'Корпус', key: 'building', width: 80, render: (row: Room) => h(NTag, { size: 'small' }, () => row.building) },
  { title: 'Этаж', key: 'floor', width: 70 },
  { title: 'Тип', key: 'type', width: 140, render: (row: Room) => h(NTag, { type: row.type === 'meeting' ? 'info' : 'default', size: 'small' }, () => getTypeLabel(row.type)) },
  { title: 'Вмест.', key: 'capacity', width: 70 },
  { title: '', key: 'actions', width: 100, render: (row: Room) => h(NButton, { size: 'small', type: 'error', onClick: () => deleteRoom(row.id) }, () => 'Удалить') }
]

const buildingColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Название', key: 'name' },
  { title: 'Этажей', key: 'floors', width: 100 },
  { title: '', key: 'actions', width: 100, render: (row: Building) => h(NButton, { size: 'small', type: 'error', onClick: () => deleteBuilding(row.id) }, () => 'Удалить') }
]

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    coworking: 'Коворкинг',
    meeting: 'Переговорная',
    classroom: 'Аудитория',
    lab: 'Лаборатория',
    conference: 'Конференц-зал'
  }
  return labels[type] || type
}

const deleteBooking = async (id: string) => {
  try {
    await $fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    message.success('Бронирование удалено')
    await loadBookings()
  } catch (error) {
    message.error('Ошибка при удалении')
  }
}

const deleteRoom = async (id: string) => {
  try {
    await $fetch(`/api/rooms/${id}`, { method: 'DELETE' })
    message.success('Комната удалена')
    await loadRooms()
  } catch (error) {
    message.error('Ошибка при удалении')
  }
}

const deleteBuilding = async (id: string) => {
  try {
    await $fetch(`/api/buildings/${id}`, { method: 'DELETE' })
    message.success('Корпус удалён')
    await loadBuildings()
  } catch (error) {
    message.error('Ошибка при удалении')
  }
}

const addRoom = async () => {
  if (!newRoom.value.building || !newRoom.value.floor || !newRoom.value.name) {
    message.warning('Заполните корпус, этаж и название')
    return
  }

  try {
    const amenities = newRoom.value.amenities.split(',').map(s => s.trim()).filter(Boolean)
    
    await $fetch('/api/rooms', {
      method: 'POST',
      body: {
        id: generatedId.value,
        name: newRoom.value.name,
        type: newRoom.value.type,
        building: newRoom.value.building,
        floor: newRoom.value.floor,
        capacity: newRoom.value.capacity,
        amenities
      }
    })

    message.success('Комната добавлена')
    newRoom.value = { building: null, floor: null, type: 'coworking', name: '', capacity: 4, amenities: '' }
    await loadRooms()
  } catch (error: any) {
    message.error(error.data?.message || 'Ошибка при добавлении комнаты')
  }
}

const addBuilding = async () => {
  if (!newBuilding.value.id || !newBuilding.value.name) {
    message.warning('Заполните ID и название корпуса')
    return
  }

  try {
    await $fetch('/api/buildings', {
      method: 'POST',
      body: {
        id: newBuilding.value.id.toUpperCase(),
        name: newBuilding.value.name,
        floors: newBuilding.value.floors
      }
    })

    message.success('Корпус добавлен')
    newBuilding.value = { id: '', name: '', floors: 1 }
    await loadBuildings()
  } catch (error: any) {
    message.error(error.data?.message || 'Ошибка при добавлении корпуса')
  }
}

const loadBookings = async () => {
  bookings.value = await $fetch<Booking[]>('/api/bookings')
}

const loadRooms = async () => {
  rooms.value = await $fetch<Room[]>('/api/rooms')
}

const loadBuildings = async () => {
  buildings.value = await $fetch<Building[]>('/api/buildings')
}

onMounted(async () => {
  if (!auth.isLoggedIn || !auth.isAdmin) {
    router.push('/')
    return
  }
  await loadBookings()
  await loadRooms()
  await loadBuildings()
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
}

.bookings-table :deep(.n-data-table-th) {
  background: #FAFDFF !important;
}

.rooms-table :deep(.n-data-table-th) {
  background: #FAFDFF !important;
}
</style>
