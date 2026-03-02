<template>
  <div class="my-bookings-page">
    <div class="page-header">
      <NuxtLink to="/" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="back-icon">
          <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ t('backToList') }}
      </NuxtLink>
      <h1 class="page-title">{{ t('myBookings') }}</h1>
    </div>

    <div v-if="loading" class="loading">
      <n-spin size="large" />
    </div>

    <template v-else>
      <div v-if="userBookings.length === 0" class="no-bookings">
        <svg viewBox="0 0 24 24" fill="none" width="64" height="64">
          <circle cx="12" cy="12" r="10" stroke="#43A047" stroke-width="2"/>
          <path d="M9 12L11 14L15 10" stroke="#43A047" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2>У вас пока нет бронирований</h2>
        <p>Забронируйте комнату прямо сейчас!</p>
        <NuxtLink to="/">
          <n-button type="primary">{{ t('bookRoom') }}</n-button>
        </NuxtLink>
      </div>

      <div v-else class="bookings-container">
        <n-card v-for="booking in userBookings" :key="booking.id" class="booking-card">
          <div class="booking-content">
            <div class="booking-room">
              <div class="room-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 21V7L12 3L21 7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 21V13H15V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="room-details">
                <h3 class="room-name">{{ booking.roomName }}</h3>
                <span class="room-location">{{ booking.roomLocation }}</span>
              </div>
            </div>

            <div class="booking-info">
              <div class="booking-date">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>{{ formatDate(booking.date) }}</span>
              </div>
              <div class="booking-time">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>{{ booking.startTime }} - {{ booking.endTime }}</span>
              </div>
            </div>

            <div class="booking-title-section">
              <span class="booking-title">{{ booking.title || 'Без названия' }}</span>
            </div>

            <div class="booking-actions">
              <n-tag v-if="isPast(booking)" type="default" size="small">Завершено</n-tag>
              <n-tag v-else-if="isCurrent(booking)" type="warning" size="small">Сейчас</n-tag>
              <n-tag v-else type="success" size="small">Предстоит</n-tag>
              <n-button v-if="!isPast(booking)" type="error" size="small" @click="cancelBooking(booking.id)">
                Отменить
              </n-button>
            </div>
          </div>
        </n-card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NSpin, NTag, useMessage } from 'naive-ui'
import { useAuthStore } from '~/stores/auth'
import { useI18n } from '~/composables/useI18n'

interface Booking {
  id: string
  roomId: string
  roomName?: string
  roomLocation?: string
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
  location: string
}

const router = useRouter()
const auth = useAuthStore()
const message = useMessage()
const { t, isRu } = useI18n()

const bookings = ref<Booking[]>([])
const rooms = ref<Room[]>([])
const loading = ref(true)

const userBookings = computed(() => {
  return bookings.value
    .filter(b => b.userId === auth.userId)
    .map(b => {
      const room = rooms.value.find(r => r.id === b.roomId)
      return {
        ...b,
        roomName: room?.name || b.roomId,
        roomLocation: room?.location || ''
      }
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      if (dateA !== dateB) return dateA - dateB
      const [ash, asm] = a.startTime.split(':').map(Number)
      const [bsh, bsm] = b.startTime.split(':').map(Number)
      return (ash * 60 + asm) - (bsh * 60 + bsm)
    })
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const daysRu = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthsRu = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  if (isRu.value) {
    return `${date.getDate()} ${monthsRu[date.getMonth()]} ${date.getFullYear()}, ${daysRu[date.getDay()]}`
  }
  return `${monthsEn[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (${daysEn[date.getDay()]})`
}

const isPast = (booking: Booking) => {
  const now = new Date()
  const bookingDate = new Date(booking.date)
  const [eh, em] = booking.endTime.split(':').map(Number)
  
  if (bookingDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return true
  if (bookingDate.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
    return now.getHours() * 60 + now.getMinutes() >= eh * 60 + em
  }
  return false
}

const isCurrent = (booking: Booking) => {
  const now = new Date()
  const bookingDate = new Date(booking.date)
  const [sh, sm] = booking.startTime.split(':').map(Number)
  const [eh, em] = booking.endTime.split(':').map(Number)
  const currentMins = now.getHours() * 60 + now.getMinutes()
  
  if (bookingDate.getTime() !== new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) return false
  return currentMins >= sh * 60 + sm && currentMins < eh * 60 + em
}

const cancelBooking = async (id: string) => {
  try {
    await $fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    message.success('Бронирование отменено')
    await loadData()
  } catch (error: any) {
    message.error(error.data?.message || 'Ошибка при отмене бронирования')
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const [bookingsData, roomsData] = await Promise.all([
      $fetch<Booking[]>('/api/bookings'),
      $fetch<Room[]>('/api/rooms')
    ])
    bookings.value = bookingsData
    rooms.value = roomsData
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }
  await loadData()
})
</script>

<style scoped>
.my-bookings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  margin-bottom: 32px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #1E88E5;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  color: #1565C0;
}

.back-icon {
  width: 20px;
  height: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1565C0;
  margin: 0;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px;
}

.no-bookings {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;
  color: #43A047;
}

.no-bookings h2 {
  margin: 0;
  color: #37474F;
  font-size: 24px;
}

.no-bookings p {
  margin: 0;
  color: #78909C;
  font-size: 16px;
}

.bookings-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.booking-card {
  border-radius: 16px !important;
}

.booking-content {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.booking-room {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.room-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  flex-shrink: 0;
}

.room-icon svg {
  width: 100%;
  height: 100%;
  stroke: white;
}

.room-details {
  display: flex;
  flex-direction: column;
}

.room-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1565C0;
}

.room-location {
  font-size: 13px;
  color: #78909C;
}

.booking-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.booking-date,
.booking-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #546E7A;
  font-size: 14px;
}

.booking-date svg,
.booking-time svg {
  flex-shrink: 0;
}

.booking-title-section {
  flex: 1;
  min-width: 150px;
}

.booking-title {
  font-size: 15px;
  color: #37474F;
  font-weight: 500;
}

.booking-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.dark .page-title {
  color: #64b5f6;
}

.dark .back-link {
  color: #64b5f6;
}

.dark .back-link:hover {
  color: #42A5F5;
}

.dark .room-name {
  color: #64b5f6;
}

.dark .room-location {
  color: #a0a0a0;
}

.dark .booking-date,
.dark .booking-time {
  color: #a0a0a0;
}

.dark .booking-title {
  color: #e0e0e0;
}

.dark .room-icon {
  background: linear-gradient(135deg, #1565C0 0%, #1976D2 100%);
}

.dark .no-bookings h2 {
  color: #e0e0e0;
}

.dark .no-bookings p {
  color: #a0a0a0;
}

@media (max-width: 600px) {
  .booking-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .booking-actions {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
