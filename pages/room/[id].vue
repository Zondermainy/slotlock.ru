<template>
  <div class="room-page">
    <NuxtLink to="/" class="back-link">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="back-icon">
        <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      К списку комнат
    </NuxtLink>

    <div v-if="!room" class="loading">
      <n-spin size="large" />
    </div>

    <template v-else>
      <div class="room-header">
        <div class="room-title-section">
          <div class="room-icon-large">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 21V7L12 3L21 7V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 21V13H15V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <n-h1 class="room-title">
              {{ room.name }}
              <n-tag size="small" class="building-badge">Корпус {{ room.building }}</n-tag>
            </n-h1>
            <n-text depth="2" class="room-meta">
              {{ room.location }} • До {{ room.capacity }} чел.
              <n-tag v-if="['meeting', 'conference', 'lab'].includes(room.type)" size="small" type="info" style="margin-left: 8px">Круглосуточно</n-tag>
              <n-tag v-else size="small" type="default" style="margin-left: 8px">09:00 - 21:00</n-tag>
            </n-text>
          </div>
        </div>
        <div class="room-amenities">
          <n-tag v-for="amenity in room.amenities" :key="amenity" size="small" class="amenity-tag">
            {{ amenity }}
          </n-tag>
        </div>
      </div>

      <n-card class="booking-card">
        <template #header>
          <div class="card-header-title">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="card-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#1E88E5" stroke-width="2"/>
              <path d="M16 2V6" stroke="#1E88E5" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 2V6" stroke="#1E88E5" stroke-width="2" stroke-linecap="round"/>
              <path d="M3 10H21" stroke="#1E88E5" stroke-width="2"/>
            </svg>
            <span>Бронирование</span>
          </div>
        </template>

        <div class="booking-form">
          <n-form-item label="Дата">
            <n-date-picker
              v-model:value="selectedDateTs"
              type="date"
              :is-date-disabled="(ts: number) => ts < Date.now() - 86400000"
              style="width: 100%"
              @update:value="onDateChange"
            />
          </n-form-item>

          <div class="time-range-section">
            <div class="time-labels">
              <div class="time-input-group">
                <label>Начало</label>
                <n-select v-model:value="startHour" :options="startHourOptions" />
              </div>
              <div class="time-arrow">→</div>
              <div class="time-input-group">
                <label>Конец</label>
                <n-select v-model:value="endHour" :options="endHourOptions" />
              </div>
            </div>

            <div class="duration-badge">
              Длительность: <strong>{{ duration }}</strong> ч.
            </div>
          </div>

          <n-form-item label="Название (цель бронирования)">
            <n-input v-model:value="bookingTitle" placeholder="Например: Подготовка к экзамену" />
          </n-form-item>

          <div v-if="conflictWarning" class="conflict-warning">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M12 9V13" stroke="#C62828" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 17H12.01" stroke="#C62828" stroke-width="2" stroke-linecap="round"/>
              <path d="M10.29 3.86L1.82 18C1.64 18.3 1.55 18.64 1.55 19C1.55 19.35 1.64 19.69 1.82 20C2 20.3 2.25 20.55 2.55 20.73C2.85 20.91 3.19 21 3.54 21H20.46C20.81 21 21.15 20.91 21.45 20.73C21.75 20.55 22 20.3 22.18 20C22.36 19.69 22.45 19.35 22.45 19C22.45 18.64 22.36 18.3 22.18 18L13.71 3.86C13.53 3.56 13.28 3.31 12.98 3.13C12.68 2.95 12.34 2.86 12 2.86C11.66 2.86 11.32 2.95 11.02 3.13C10.72 3.31 10.47 3.56 10.29 3.86Z" stroke="#C62828" stroke-width="2"/>
            </svg>
            <span>{{ conflictWarning }}</span>
          </div>

          <div v-if="isPast" class="conflict-warning">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M12 9V13" stroke="#C62828" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 17H12.01" stroke="#C62828" stroke-width="2" stroke-linecap="round"/>
              <path d="M10.29 3.86L1.82 18C1.64 18.3 1.55 18.64 1.55 19C1.55 19.35 1.64 19.69 1.82 20C2 20.3 2.25 20.55 2.55 20.73C2.85 20.91 3.19 21 3.54 21H20.46C20.81 21 21.15 20.91 21.45 20.73C21.75 20.55 22 20.3 22.18 20C22.36 19.69 22.45 19.35 22.45 19C22.45 18.64 22.36 18.3 22.18 18L13.71 3.86C13.53 3.56 13.28 3.31 12.98 3.13C12.68 2.95 12.34 2.86 12 2.86C11.66 2.86 11.32 2.95 11.02 3.13C10.72 3.31 10.47 3.56 10.29 3.86Z" stroke="#C62828" stroke-width="2"/>
            </svg>
            <span>Нельзя забронировать на прошедшее время</span>
          </div>

          <n-button
            type="primary"
            class="submit-btn"
            :loading="isBooking"
            :disabled="!canBook"
            @click="createBooking"
          >
            Забронировать
          </n-button>
        </div>
      </n-card>

      <n-card class="timeline-card" style="margin-top: 24px">
        <template #header>
          <div class="card-header-title">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="card-icon">
              <circle cx="12" cy="12" r="10" stroke="#1E88E5" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="#1E88E5" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Расписание на {{ formattedSelectedDate }}</span>
          </div>
        </template>

        <div class="timeline-visual">
          <div class="timeline-hours">
            <div v-for="h in displayHours" :key="h" class="hour-label">{{ h }}:00</div>
          </div>
          <div class="timeline-bars">
            <div
              v-for="h in displayHours"
              :key="`bar-${h}`"
              class="hour-bar"
              :class="{ 'is-busy': isHourBusy(h) }"
            >
              <span v-if="isFirstHourOfBooking(h)" class="busy-label">
                {{ getBookingForHour(h)?.title || 'Занято' }}
              </span>
            </div>
          </div>
        </div>

        <div class="timeline-legend">
          <div class="legend-item">
            <span class="legend-color free"></span>
            <span>Свободно</span>
          </div>
          <div class="legend-item">
            <span class="legend-color busy"></span>
            <span>Занято</span>
          </div>
        </div>
      </n-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NText, NTag, NSpin, NInput, NFormItem, NSelect, NDatePicker, useMessage } from 'naive-ui'
import { useAuthStore } from '~/stores/auth'

interface Room {
  id: string
  name: string
  type: string
  building: string
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

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const message = useMessage()

const roomId = route.params.id as string
const room = ref<Room | null>(null)
const bookings = ref<Booking[]>([])
const selectedDateTs = ref<number>(Date.now())
const selectedDate = computed(() => {
  const d = new Date(selectedDateTs.value)
  return d.toISOString().split('T')[0]
})

const onDateChange = () => {
  loadBookings()
  // Reset to next available hour when date changes
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentHour = now.getHours() + 1
  const minHour = ['meeting', 'conference', 'lab'].includes(room.value?.type) ? 0 : 9
  
  if (selectedDate.value === today) {
    const defaultStart = Math.max(currentHour, minHour)
    startHour.value = defaultStart.toString().padStart(2, '0')
    endHour.value = (defaultStart + 1).toString().padStart(2, '0')
  } else {
    startHour.value = minHour.toString().padStart(2, '0')
    endHour.value = (minHour + 1).toString().padStart(2, '0')
  }
}
const startHour = ref<string>('09')
const endHour = ref<string>('10')
const bookingTitle = ref('')
const isBooking = ref(false)

const displayHours = computed(() => {
  if (['meeting', 'conference', 'lab'].includes(room.value?.type)) {
    return Array.from({ length: 24 }, (_, i) => i)
  }
  return Array.from({ length: 13 }, (_, i) => i + 9)
})

const endHourOptions = computed(() => {
  const start = parseInt(startHour.value)
  const maxHours = ['meeting', 'conference', 'lab'].includes(room.value?.type) ? 24 : 8
  const maxEnd = Math.min(start + maxHours, displayHours.value[displayHours.value.length - 1] + 1)
  
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentHour = now.getHours()
  
  const options = []
  for (let h = start + 1; h <= maxEnd; h++) {
    // Skip past hours for today
    if (selectedDate.value === today && h <= currentHour) continue
    options.push({
      label: `${h.toString().padStart(2, '0')}:00`,
      value: h.toString().padStart(2, '0')
    })
  }
  return options
})

const duration = computed(() => {
  return parseInt(endHour.value) - parseInt(startHour.value)
})

const isPast = computed(() => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentHour = now.getHours()
  
  if (selectedDate.value < today) return true
  if (selectedDate.value === today && parseInt(startHour.value) <= currentHour) return true
  return false
})

const canBook = computed(() => {
  return startHour.value && endHour.value && duration.value > 0 && duration.value <= 8 && !conflictWarning.value && !isPast.value
})

const startHourOptions = computed(() => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentHour = now.getHours()
  
  return displayHours.value
    .filter(h => selectedDate.value > today || h > currentHour)
    .map(h => ({
      label: `${h.toString().padStart(2, '0')}:00`,
      value: h.toString().padStart(2, '0')
    }))
})

const dayBookings = computed(() => {
  return bookings.value.filter(b => b.date === selectedDate.value && b.roomId === roomId)
})

const isHourBusy = (hour: number) => {
  const hourStr = hour.toString().padStart(2, '0')
  return dayBookings.value.some(b => 
    b.startTime <= hourStr && b.endTime > hourStr
  )
}

const isFirstHourOfBooking = (hour: number) => {
  const hourStr = hour.toString().padStart(2, '0')
  const booking = getBookingForHour(hour)
  if (!booking) return false
  return booking.startTime === hourStr
}

const getBookingForHour = (hour: number) => {
  const hourStr = hour.toString().padStart(2, '0')
  return dayBookings.value.find(b => 
    b.startTime <= hourStr && b.endTime > hourStr
  )
}

const conflictWarning = computed(() => {
  const start = parseInt(startHour.value)
  const end = parseInt(endHour.value)
  
  for (let h = start; h < end; h++) {
    const hourStr = h.toString().padStart(2, '0')
    const booking = dayBookings.value.find(b => 
      b.startTime <= hourStr && b.endTime > hourStr
    )
    if (booking) {
      return `Пересечение с бронью "${booking.title}" (${booking.startTime}:00 - ${booking.endTime}:00)`
    }
  }
  return null
})

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  // Create date at noon to avoid timezone issues
  const d = new Date(selectedDate.value + 'T12:00:00')
  const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
  return `${d.getDate()} ${d.getMonth() + 1} ${dayNames[d.getDay()]}`
})

const loadBookings = async () => {
  bookings.value = await $fetch<Booking[]>('/api/bookings', {
    query: { roomId }
  })
}

const createBooking = async () => {
  if (!auth.userId || !canBook.value) return
  
  isBooking.value = true
  try {
    await $fetch('/api/bookings', {
      method: 'POST',
      body: {
        roomId,
        userId: auth.userId,
        userName: auth.userName,
        title: bookingTitle.value || 'Без названия',
        date: selectedDate.value,
        startTime: startHour.value,
        endTime: endHour.value
      }
    })
    
    message.success('Бронирование успешно создано!')
    bookingTitle.value = ''
    await loadBookings()
  } catch (error: any) {
    message.error(error.data?.message || 'Ошибка при бронировании')
  } finally {
    isBooking.value = false
  }
}

watch(startHour, () => {
  if (parseInt(endHour.value) <= parseInt(startHour.value)) {
    endHour.value = (parseInt(startHour.value) + 1).toString().padStart(2, '0')
  }
})

onMounted(async () => {
  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }
  
  room.value = await $fetch<Room>(`/api/rooms/${roomId}`)
  await loadBookings()
  
  // Set default hours to next available hour
  const now = new Date()
  const currentHour = now.getHours() + 1
  const minHour = room.value.type === 'meeting' ? 0 : 9
  const defaultStart = Math.max(currentHour, minHour)
  
  startHour.value = defaultStart.toString().padStart(2, '0')
  endHour.value = (defaultStart + 1).toString().padStart(2, '0')
})
</script>

<style scoped>
.room-page {
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

.back-link:hover {
  color: #1565C0;
}

.back-icon {
  width: 20px;
  height: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.room-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.room-icon-large {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.room-icon-large svg {
  width: 100%;
  height: 100%;
}

.room-title {
  color: #1565C0 !important;
  margin-bottom: 4px !important;
  display: flex;
  align-items: center;
  gap: 12px;
}

.building-badge {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%) !important;
  color: #1565C0 !important;
  border: none !important;
  font-weight: 600;
}

.room-meta {
  font-size: 15px;
}

.room-amenities {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.amenity-tag {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%) !important;
  color: #1565C0 !important;
  border: none !important;
}

.booking-card, .timeline-card {
  border-radius: 16px !important;
}

.card-header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1565C0;
}

.card-icon {
  width: 24px;
  height: 24px;
}

.time-range-section {
  margin: 20px 0;
  padding: 20px;
  background: #FAFDFF;
  border-radius: 12px;
}

.time-labels {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.time-input-group {
  flex: 1;
  max-width: 150px;
}

.time-input-group label {
  display: block;
  text-align: center;
  margin-bottom: 8px;
  font-weight: 500;
  color: #546E7A;
}

.time-arrow {
  font-size: 24px;
  color: #1E88E5;
  padding-top: 24px;
}

.duration-badge {
  text-align: center;
  margin-top: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  font-size: 15px;
}

.duration-badge strong {
  color: #1E88E5;
}

.conflict-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #FFEBEE;
  border-radius: 8px;
  color: #C62828;
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%) !important;
  border: none !important;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565C0 0%, #1E88E5 100%) !important;
}

.timeline-visual {
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding: 8px 0;
}

.timeline-hours {
  flex-shrink: 0;
  width: 50px;
}

.hour-label {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  font-size: 11px;
  color: #90A4AE;
}

.timeline-bars {
  flex: 1;
  display: flex;
  min-width: 0;
}

.hour-bar {
  flex: 1;
  min-width: 30px;
  height: 32px;
  background: #E3F2FD;
  border-right: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #546E7A;
}

.hour-bar.is-busy {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
}

.busy-label {
  color: #C62828;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.timeline-legend {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E3F2FD;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #546E7A;
  font-size: 14px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.free {
  background: #E3F2FD;
}

.legend-color.busy {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
}
</style>
