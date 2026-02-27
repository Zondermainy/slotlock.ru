<template>
  <div class="home-page">
    <div class="hero">
      <div class="hero-icon">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="url(#grad)"/>
          <path d="M20 32L28 24L36 32L28 40L20 32Z" fill="white"/>
          <path d="M36 24L44 32L36 40L28 32L36 24Z" fill="white" fill-opacity="0.7"/>
          <circle cx="20" cy="32" r="3" fill="white" fill-opacity="0.5"/>
          <circle cx="44" cy="32" r="3" fill="white" fill-opacity="0.5"/>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stop-color="#1565C0"/>
              <stop offset="100%" stop-color="#42A5F5"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1>Бронирование коворкингов</h1>
      <p>Бронирование коворкингов ДВФУ</p>
      <p class="subtitle">выберите комнату для работы или встречи</p>
    </div>

    <div v-if="!auth.isLoggedIn" class="auth-warning">
      <n-alert type="info" class="warning-alert">
        <template #header>Требуется авторизация</template>
        Для бронирования необходимо <NuxtLink to="/login">войти в систему</NuxtLink>
      </n-alert>
    </div>

    <div class="building-selector">
      <n-text strong class="selector-label">Выберите корпус:</n-text>
      <div class="building-buttons">
        <n-button
          :type="selectedBuilding === 'all' ? 'primary' : 'default'"
          :class="{ active: selectedBuilding === 'all' }"
          @click="selectedBuilding = 'all'"
        >
          Все корпуса
        </n-button>
        <n-button
          v-for="b in buildings"
          :key="b"
          :type="selectedBuilding === b ? 'primary' : 'default'"
          :class="{ active: selectedBuilding === b }"
          @click="selectedBuilding = b"
        >
          Корпус {{ b }}
        </n-button>
      </div>
    </div>

    <div class="section-header" v-if="filteredRooms.length > 0">
      <n-h2 class="section-title">{{ sectionTitle }}</n-h2>
      <div class="section-line"></div>
    </div>
    
    <div v-if="filteredRooms.length === 0" class="no-rooms">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="no-rooms-icon">
        <path d="M3 21V7L12 3L21 7V21" stroke="#90A4AE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 21V13H15V21" stroke="#90A4AE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <n-text depth="3">В этом корпусе пока нет доступных комнат</n-text>
    </div>

    <div v-else class="rooms-grid">
      <n-card
        v-for="room in filteredRooms"
        :key="room.id"
        class="room-card"
        hoverable
      >
        <template #header>
          <div class="room-header">
            <div class="room-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21V7L12 3L21 7V21" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 21V13H15V21" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <n-text strong class="room-name">{{ room.name }}</n-text>
            <n-tag class="building-tag" size="small">Корпус {{ room.building }}</n-tag>
          </div>
        </template>
        
        <div class="room-status" :class="getRoomStatus(room.id).class">
          <div class="status-dot"></div>
          <span class="status-text">{{ getRoomStatus(room.id).text }}</span>
        </div>
        
        <div class="room-info">
          <div class="room-location">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="info-icon">
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#1E88E5" stroke-width="2"/>
              <path d="M12 22C12 22 20 16 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 16 12 22 12 22Z" stroke="#1E88E5" stroke-width="2"/>
            </svg>
            <n-text depth="3">{{ room.location }}</n-text>
          </div>
          <div class="room-capacity">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="info-icon">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Этаж {{ room.floor }} • До {{ room.capacity }} чел.</span>
          </div>
          <div class="room-amenities">
            <n-tag
              v-for="amenity in room.amenities"
              :key="amenity"
              size="small"
              class="amenity-tag"
            >
              {{ amenity }}
            </n-tag>
          </div>
        </div>
        
        <template #action>
          <NuxtLink :to="`/room/${room.id}`">
            <n-button type="primary" block class="book-btn" :disabled="!auth.isLoggedIn">
              <template #icon>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
                </svg>
              </template>
              Выбрать время
            </n-button>
          </NuxtLink>
        </template>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NText, NTag, NAlert, NH2, NSelect } from 'naive-ui'
import { useAuthStore } from '~/stores/auth'

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

interface Building {
  id: string
  name: string
  floors: number
}

const auth = useAuthStore()
const rooms = ref<Room[]>([])
const bookings = ref<Booking[]>([])
const buildingsList = ref<Building[]>([])
const selectedBuilding = ref<string>('all')

const filteredRooms = computed(() => {
  if (selectedBuilding.value === 'all') {
    return rooms.value
  }
  return rooms.value.filter(r => r.building === selectedBuilding.value)
})

const buildings = computed(() => {
  return buildingsList.value.map(b => b.id)
})

const sectionTitle = computed(() => {
  if (selectedBuilding.value === 'all') {
    return 'Доступные комнаты'
  }
  return `Корпус ${selectedBuilding.value}`
})

const getCurrentBooking = (roomId: string) => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentHour = now.getHours().toString().padStart(2, '0')
  
  return bookings.value.find(b => 
    b.roomId === roomId && 
    b.date === today &&
    b.startTime <= currentHour &&
    b.endTime > currentHour
  )
}

const getRoomStatus = (roomId: string) => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentBooking = getCurrentBooking(roomId)
  
  if (currentBooking) {
    return {
      text: `Занято ${currentBooking.startTime}:00 - ${currentBooking.endTime}:00`,
      class: 'status-busy'
    }
  }
  
  const nextBooking = bookings.value
    .filter(b => b.roomId === roomId && b.date === now.toISOString().split('T')[0] && parseInt(b.startTime) > currentHour)
    .sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime))[0]
  
  if (nextBooking) {
    return {
      text: `Свободна. Следующая бронь: ${nextBooking.startTime}:00`,
      class: 'status-free'
    }
  }
  
  return {
    text: 'Свободна сейчас',
    class: 'status-free'
  }
}

onMounted(async () => {
  rooms.value = await $fetch<Room[]>('/api/rooms')
  bookings.value = await $fetch<Booking[]>('/api/bookings')
  buildingsList.value = await $fetch<Building[]>('/api/buildings')
  
  setInterval(async () => {
    rooms.value = await $fetch<Room[]>('/api/rooms')
    bookings.value = await $fetch<Booking[]>('/api/bookings')
    buildingsList.value = await $fetch<Building[]>('/api/buildings')
  }, 30000)
})
</script>

<style scoped>
.home-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero {
  text-align: center;
  margin-bottom: 48px;
  padding: 32px 0;
}

.hero-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.hero-icon svg {
  width: 100%;
  height: 100%;
}

.hero h1 {
  font-size: 36px;
  margin-bottom: 12px;
  color: #1565C0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.hero p {
  color: #546E7A;
  font-size: 18px;
  font-weight: 400;
}

.auth-warning {
  margin-bottom: 24px;
}

.warning-alert {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 12px;
}

.warning-alert a {
  color: #1E88E5;
  font-weight: 600;
}

.building-selector {
  margin-bottom: 32px;
}

.selector-label {
  display: block;
  margin-bottom: 12px;
  font-size: 16px;
  color: #1565C0;
}

.building-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.building-buttons :deep(.n-button) {
  border-radius: 8px;
}

.building-buttons :deep(.n-button.active) {
  background: linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%) !important;
  color: white !important;
}

.warning-alert {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 12px;
}

.warning-alert a {
  color: #1E88E5;
  font-weight: 600;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  color: #1565C0 !important;
  font-weight: 600 !important;
  margin-bottom: 8px !important;
}

.section-line {
  height: 3px;
  width: 60px;
  background: linear-gradient(90deg, #1E88E5, #42A5F5);
  border-radius: 2px;
}

.no-rooms {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.no-rooms-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.room-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
}

.room-status.status-free {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  color: #2E7D32;
}

.room-status.status-busy {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
  color: #C62828;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-free .status-dot {
  background: #4CAF50;
}

.status-busy .status-dot {
  background: #F44336;
}

.room-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(30, 136, 229, 0.1);
}

.room-card:hover {
  transform: translateY(-4px);
  border-color: rgba(30, 136, 229, 0.3);
}

.room-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.room-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}

.room-icon svg {
  width: 100%;
  height: 100%;
}

.room-name {
  font-size: 18px !important;
  color: #1565C0;
}

.building-tag {
  margin-left: auto !important;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%) !important;
  color: #1565C0 !important;
  border: none !important;
  font-weight: 600;
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-location,
.room-capacity {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #546E7A;
}

.info-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.room-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.amenity-tag {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%) !important;
  color: #1565C0 !important;
  border: none !important;
}

.book-btn {
  height: 44px;
  font-weight: 600;
  font-size: 15px;
  background: linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%) !important;
  border: none !important;
  transition: all 0.3s ease;
}

.book-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565C0 0%, #1E88E5 100%) !important;
  transform: scale(1.02);
}
</style>
