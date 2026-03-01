<template>
  <div class="room-page">
    <NuxtLink to="/" class="back-link">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="back-icon">
        <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {{ t('backToList') }}
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
              {{ getRoomName(room) }}
              <n-tag size="small" class="building-badge">{{ t('building') }} {{ room.building }}</n-tag>
            </n-h1>
            <n-text depth="2" class="room-meta">
              {{ room.location }} • {{ t('capacity') }} {{ room.capacity }} {{ t('people') }}
              <n-tag v-if="['meeting', 'conference', 'lab'].includes(room.type)" size="small" type="info" style="margin-left: 8px">{{ t('roundTheClock') }}</n-tag>
              <n-tag v-else size="small" type="default" style="margin-left: 8px">{{ t('workingHours') }}</n-tag>
            </n-text>
          </div>
        </div>
        <div class="room-amenities">
          <n-tag v-for="amenity in parseAmenities(room.amenities)" :key="amenity" size="small" class="amenity-tag">
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
          <n-form-item :label="t('selectDate')">
            <div class="date-picker-wrapper">
              <n-date-picker
                v-model:value="selectedDateTs"
                type="date"
                :is-date-disabled="(ts: number) => ts < Date.now() - 86400000 || ts > Date.now() + 14 * 86400000"
                style="width: 100%"
                @update:value="onDateChange"
              />
              <div v-if="formattedSelectedDate" class="formatted-date">
                {{ formattedSelectedDate }}
              </div>
            </div>
          </n-form-item>

          <div class="time-range-section">
            <div class="time-labels">
              <div class="time-input-group">
                <label>{{ t('startTime') }}</label>
                <n-select v-model:value="startHour" :options="startTimeOptions" />
              </div>
              <div class="time-arrow">→</div>
              <div class="time-input-group">
                <label>{{ t('endTime') }}</label>
                <n-select v-model:value="endHour" :options="endTimeOptions" />
              </div>
            </div>

            <div class="duration-badge">
              {{ t('duration') }}: <strong>{{ formattedDuration }}</strong>
            </div>
          </div>

          <n-form-item :label="t('bookingTitleLabel')">
            <n-input v-model:value="bookingTitle" :placeholder="t('bookingPlaceholder')" :maxlength="100" show-count />
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
            <span>{{ t('pastTimeError') }}</span>
          </div>

          <n-button
            type="primary"
            class="submit-btn"
            :loading="isBooking"
            :disabled="!canBook"
            @click="createBooking"
          >
            {{ t('book') }}
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
            <span>{{ t('schedule') }} {{ formattedSelectedDate }}</span>
          </div>
        </template>

        <div class="timeline-visual">
          <div class="timeline-rows">
            <div
              v-for="h in displayHours"
              :key="h"
              class="timeline-row"
              :class="{ 'is-busy': isHourBusy(h) }"
            >
              <div class="hour-label">{{ h }}:00</div>
              <div class="hour-bar">
                <span v-if="isFirstHourOfBooking(h)" class="busy-label">
                  {{ getBookingForHour(h)?.title || t('busyTime') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="timeline-legend">
          <div class="legend-item">
            <span class="legend-color free"></span>
            <span>{{ t('freeTime') }}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color busy"></span>
            <span>{{ t('busyTime') }}</span>
          </div>
        </div>
      </n-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NText, NTag, NSpin, NInput, NFormItem, NSelect, NDatePicker, useMessage } from 'naive-ui'
import { useAuthStore } from '~/stores/auth'
import { useI18n } from '~/composables/useI18n'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const message = useMessage()
const { t, dayNames, monthNames, isRu } = useI18n()

const parseAmenities = (amenitiesStr: string | string[]) => {
  if (!amenitiesStr) return []
  if (Array.isArray(amenitiesStr)) return amenitiesStr
  
  return amenitiesStr.split(',').map(s => {
    if (!isRu.value && s.includes(';')) {
      const parts = s.split(';')
      return parts[1]?.trim() || parts[0].trim()
    }
    return s.trim()
  }).filter(Boolean)
}

const getRoomName = (room: any) => {
  if (!isRu.value && room.name && room.name.includes(';')) {
    const parts = room.name.split(';')
    return parts[1]?.trim() || parts[0].trim()
  }
  return room.name
}

const roomId = route.params.id as string
const room = ref<Room | null>(null)
const bookings = ref<Booking[]>([])
const selectedDateTs = ref<number>(Date.now())
const selectedDate = computed(() => {
  const d = new Date(selectedDateTs.value)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
})

const selectedDateLocal = computed(() => {
  const d = new Date(selectedDateTs.value)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return { year, month, day, dateStr: `${year}-${month}-${day}` }
})

const onDateChange = () => {
  loadBookings()
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
  const currentHour = now.getHours() + 1
  const minHour = ['meeting', 'conference', 'lab'].includes(room.value?.type) ? 0 : 9
  
  if (selectedDateLocal.value.dateStr === todayStr) {
    const defaultStart = Math.max(currentHour, minHour)
    startHour.value = defaultStart.toString().padStart(2, '0')
    endHour.value = (defaultStart + 1).toString().padStart(2, '0')
  } else {
    startHour.value = minHour.toString().padStart(2, '0')
    endHour.value = (minHour + 1).toString().padStart(2, '0')
  }
}
const startHour = ref<string>('09:00')
const endHour = ref<string>('09:30')
const bookingTitle = ref('')
const isBooking = ref(false)

const displayHours = computed(() => {
  if (['meeting', 'conference', 'lab'].includes(room.value?.type)) {
    return Array.from({ length: 24 }, (_, i) => i)
  }
  return Array.from({ length: 13 }, (_, i) => i + 9)
})

const generateTimeOptions = (startFromZero = false) => {
  const options: { label: string; value: string }[] = []
  for (const hour of displayHours.value) {
    for (const minute of [0, 10, 20, 30, 40, 50]) {
      if (hour === 0 && minute === 0 && !startFromZero) continue
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      options.push({ label: timeStr, value: timeStr })
    }
  }
  return options
}

const startTimeOptions = computed(() => {
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  return generateTimeOptions()
    .filter(t => {
      if (selectedDateLocal.value.dateStr > todayStr) return true
      const [h, m] = t.value.split(':').map(Number)
      if (h > currentHour) return true
      if (h === currentHour && m > currentMinute) return true
      return false
    })
})

const endTimeOptions = computed(() => {
  const startParts = startHour.value.split(':').map(Number)
  const startHourNum = startParts[0]
  const startMinute = startParts[1]
  const maxHours = ['meeting', 'conference', 'lab'].includes(room.value?.type) ? 24 : 4
  const maxEnd = Math.min(startHourNum + maxHours, displayHours.value[displayHours.value.length - 1] + 1)
  
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
  const currentHour = now.getHours()
  
  return generateTimeOptions()
    .filter(t => {
      const [h, m] = t.value.split(':').map(Number)
      if (h < startHourNum) return false
      if (h === startHourNum && m <= startMinute) return false
      if (h > maxEnd) return false
      if (selectedDateLocal.value.dateStr === todayStr && h <= currentHour) return false
      return true
    })
})

const duration = computed(() => {
  const [startH, startM] = startHour.value.split(':').map(Number)
  const [endH, endM] = endHour.value.split(':').map(Number)
  return (endH * 60 + endM - (startH * 60 + startM)) / 60
})

const formattedDuration = computed(() => {
  const totalMinutes = Math.round(duration.value * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (hours > 0 && minutes > 0) {
    return `${hours}ч. ${minutes}м.`
  } else if (hours > 0) {
    return `${hours}ч.`
  } else {
    return `${minutes}мин.`
  }
})

const isPast = computed(() => {
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const [startH, startM] = startHour.value.split(':').map(Number)
  
  if (selectedDateLocal.value.dateStr < todayStr) return true
  if (selectedDateLocal.value.dateStr === todayStr) {
    if (startH < currentHour) return true
    if (startH === currentHour && startM <= currentMinute) return true
  }
  return false
})

const canBook = computed(() => {
  return startHour.value && endHour.value && duration.value > 0 && duration.value <= 4 && !conflictWarning.value && !isPast.value
})

const dayBookings = computed(() => {
  return bookings.value.filter(b => b.date === selectedDateLocal.value.dateStr && b.roomId === roomId)
})

const isTimeBusy = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number)
  const timeInMinutes = h * 60 + m
  return dayBookings.value.some(b => {
    const [bh, bm] = b.startTime.split(':').map(Number)
    const [eh, em] = b.endTime.split(':').map(Number)
    const bookStart = bh * 60 + bm
    const bookEnd = eh * 60 + em
    return timeInMinutes >= bookStart && timeInMinutes < bookEnd
  })
}

const getBookingForTime = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number)
  const timeInMinutes = h * 60 + m
  return dayBookings.value.find(b => {
    const [bh, bm] = b.startTime.split(':').map(Number)
    const [eh, em] = b.endTime.split(':').map(Number)
    const bookStart = bh * 60 + bm
    const bookEnd = eh * 60 + em
    return timeInMinutes >= bookStart && timeInMinutes < bookEnd
  })
}

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
  // Check if this is the first hour of the booking
  const prevHour = (hour - 1).toString().padStart(2, '0')
  const prevWasBooked = dayBookings.value.some(b => 
    b.startTime <= prevHour && b.endTime > prevHour && b.id === booking.id
  )
  return !prevWasBooked && booking.startTime === hourStr
}

const getBookingForHour = (hour: number) => {
  const hourStr = hour.toString().padStart(2, '0')
  return dayBookings.value.find(b => 
    b.startTime <= hourStr && b.endTime > hourStr
  )
}

const conflictWarning = computed(() => {
  const [startH, startM] = startHour.value.split(':').map(Number)
  const [endH, endM] = endHour.value.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  
  for (let m = startMinutes; m < endMinutes; m += 10) {
    const h = Math.floor(m / 60)
    const min = m % 60
    const timeStr = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
    const booking = getBookingForTime(timeStr)
    if (booking) {
      return `${t('conflict')} "${booking.title}" (${booking.startTime} - ${booking.endTime})`
    }
  }
  return null
})

const formattedSelectedDate = computed(() => {
  if (!selectedDateLocal.value) return ''
  const { day, month, year } = selectedDateLocal.value
  const monthNum = parseInt(month) - 1
  const d = new Date(parseInt(year), monthNum, parseInt(day))
  const monthsRu = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const daysRu = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  if (isRu.value) {
    return `${d.getDate()} ${monthsRu[d.getMonth()]} ${d.getFullYear()}, ${daysRu[d.getDay()]}`
  }
  return `${monthsEn[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} (${daysEn[d.getDay()]})`
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
        date: selectedDateLocal.value.dateStr,
        startTime: startHour.value,
        endTime: endHour.value
      }
    })
    
    message.success(t('bookingSuccess'))
    bookingTitle.value = ''
    await loadBookings()
    // Reset time to next available slot after successful booking
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const roundedMinute = Math.ceil(currentMinute / 10) * 10
    const minHour = ['meeting', 'conference', 'lab'].includes(room.value?.type) ? 0 : 9
    
    let nextHour = currentHour
    let nextMinute = roundedMinute
    
    if (nextMinute >= 60) {
      nextHour += 1
      nextMinute = 0
    }
    
    if (nextHour < minHour) {
      nextHour = minHour
      nextMinute = 0
    }
    
    startHour.value = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`
    endHour.value = `${(nextHour + 1).toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`
  } catch (error: any) {
    message.error(error.data?.message || t('bookingError'))
  } finally {
    isBooking.value = false
  }
}

watch(startHour, () => {
  const [startH, startM] = startHour.value.split(':').map(Number)
  const [endH, endM] = endHour.value.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  
  if (endMinutes <= startMinutes) {
    const newEndMinutes = startMinutes + 30
    const newEndH = Math.floor(newEndMinutes / 60) % 24
    const newEndM = newEndMinutes % 60
    endHour.value = `${newEndH.toString().padStart(2, '0')}:${newEndM.toString().padStart(2, '0')}`
  }
})

onMounted(async () => {
  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }
  
  room.value = await $fetch<Room>(`/api/rooms/${roomId}`)
  await loadBookings()
  
  // Set default hours to next available slot
  const now = new Date()
  const currentHour = now.getHours()
  const minHour = room.value.type === 'meeting' ? 0 : 9
  const defaultStart = Math.max(currentHour + 1, minHour)
  
  startHour.value = `${defaultStart.toString().padStart(2, '0')}:00`
  endHour.value = `${(defaultStart + 1).toString().padStart(2, '0')}:00`
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
  padding: 8px 0;
}

.timeline-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  background: #E3F2FD;
  min-height: 36px;
}

.timeline-row.is-busy {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
}

.timeline-row .hour-label {
  width: 40px;
  font-size: 12px;
  font-weight: 600;
  color: #546E7A;
  flex-shrink: 0;
}

.timeline-row .hour-bar {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #546E7A;
  min-height: 24px;
}

.timeline-row.is-busy .hour-bar {
  background: transparent;
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

.dark .time-range-section {
  background: #1a1a2e;
}

.dark .time-input-group label {
  color: #a0a0a0;
}

.dark .duration-badge {
  background: #2a2a3e;
  color: #e0e0e0;
}

.dark .duration-badge strong {
  color: #64b5f6;
}

.dark .room-amenities .amenity-tag {
  background: #2a2a3e !important;
  color: #64b5f6 !important;
  border: 1px solid #3a3a4e !important;
}

.dark .room-icon-large {
  background: linear-gradient(135deg, #1565C0 0%, #1976D2 100%);
}

.dark .room-icon svg {
  stroke: #64b5f6;
}

.dark .room-icon-large svg {
  stroke: white;
}

.dark .info-icon svg {
  stroke: #64b5f6;
}

.dark .back-link {
  color: #64b5f6;
}

.dark .back-link:hover {
  color: #42A5F5;
}

.dark .room-name {
  color: #64b5f6 !important;
}

.dark .building-tag {
  background: #2a2a3e !important;
  color: #64b5f6 !important;
  border: 1px solid #3a3a4e !important;
}

.dark .card-header-title {
  color: #64b5f6;
}

.dark .card-icon svg {
  stroke: #64b5f6;
}

.dark .timeline-row {
  background: #2a2a3e;
}

.dark .timeline-row.is-busy {
  background: linear-gradient(135deg, #3d2020 0%, #4a2828 100%);
}

.dark .timeline-row .hour-label {
  color: #a0a0a0;
}

.dark .timeline-row .hour-bar {
  color: #a0a0a0;
}

.dark .timeline-legend {
  border-top-color: #3a3a4e;
}

.dark .legend-item {
  color: #a0a0a0;
}

.dark .legend-color.free {
  background: #2a2a3e;
}

.formatted-date {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1565C0;
}

.dark .formatted-date {
  color: #64b5f6;
}

.dark .legend-color.busy {
  background: linear-gradient(135deg, #3d2020 0%, #4a2828 100%);
}
</style>
