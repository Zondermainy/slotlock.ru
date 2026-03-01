export const useI18n = () => {
  const isRu = useState('isRu', () => true)

  const translations = {
    ru: {
      // Header
      admin: 'Админ',
      adminPanel: 'Админка',
      logout: 'Выйти',
      login: 'Войти',
      
      // Index page
      bookingTitle: 'Бронирование коворкингов ДВФУ',
      selectRoom: 'выберите комнату для работы или встречи',
      authRequired: 'Требуется авторизация',
      loginToBook: 'Для бронирования необходимо войти в систему',
      selectBuilding: 'Выберите корпус:',
      allBuildings: 'Все корпуса',
      building: 'Корпус',
      floor: 'Этаж',
      availableRooms: 'Доступные комнаты',
      noRooms: 'Нет доступных комнат',
      capacity: 'до',
      people: 'чел.',
      now: 'Сейчас',
      free: 'Свободно',
      busy: 'Занято',
      until: 'до',
      selectTimeBtn: 'Выбрать время',
      nextBooking: 'Следующая бронь',
      freeNow: 'Свободна сейчас',
      
      // Room page
      backToList: 'К списку комнат',
      room: 'Комната',
      selectDate: 'Дата',
      startTime: 'Начало',
      endTime: 'Конец',
      duration: 'Длительность',
      hours: 'ч.',
      bookingTitleLabel: 'Название (цель бронирования)',
      bookingPlaceholder: 'Например: Подготовка к экзамену',
      book: 'Забронировать',
      bookingSuccess: 'Бронирование успешно создано!',
      bookingError: 'Ошибка при бронирования',
      schedule: 'Расписание на',
      freeTime: 'Свободно',
      busyTime: 'Занято',
      noName: 'Без названия',
      pastTimeError: 'Нельзя забронировать на прошедшее время',
      
      // Admin
      buildings: 'Корпуса',
      addBuilding: 'Добавить корпус',
      buildingId: 'ID корпуса',
      floors: 'Этажей',
      save: 'Сохранить',
      delete: 'Удалить',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      rooms: 'Комнаты',
      addRoom: 'Добавить комнату',
      createRoom: 'Создать комнату',
      roomName: 'Название комнаты',
      roomNameEn: 'Название (англ)',
      roomType: 'Тип комнаты',
      amenities: 'Удобства',
      amenitiesHint: 'Через запятую',
      buildingRequired: 'Выберите корпус',
      typeRequired: 'Выберите тип',
      noRoomsAdmin: 'Нет комнат',
      bookings: 'Бронирования',
      noBookings: 'Нет бронирований',
      user: 'Пользователь',
      date: 'Дата',
      time: 'Время',
      status: 'Статус',
      active: 'Активно',
      cancelled: 'Отменено',
      allTypes: 'Все типы',
      
      // Room types
      coworking: 'Коворкинг',
      meeting: 'Переговорная',
      classroom: 'Аудитория',
      lab: 'Лаборатория',
      conference: 'Конференц-зал',

      // Room location types
      library: 'Библиотека',
      studentCenter: 'Студцентр',
      science: 'Научная библиотека',
      sports: 'Спортивный корпус',
      dormitory: 'Общежитие',
      
      // Days
      sunday: 'воскресенье',
      monday: 'понедельник',
      tuesday: 'вторник',
      wednesday: 'среда',
      thursday: 'четверг',
      friday: 'пятница',
      saturday: 'суббота',
      
      // Months
      january: 'января',
      february: 'февраля',
      march: 'марта',
      april: 'апреля',
      may: 'мая',
      june: 'июня',
      july: 'июля',
      august: 'августа',
      september: 'сентября',
      october: 'октября',
      november: 'ноября',
      december: 'декабря',
      
      // Login
      welcome: 'Добро пожаловать',
      loginSubtitle: 'Войдите для бронирования',
      studentId: 'Студенческий билет',
      fullName: 'ФИО',
      loginBtn: 'Войти',
      demoMode: 'Демо-режим: выберите любого пользователя для входа',
      email: 'Email',
      password: 'Пароль',
      enterEmail: 'Введите email',
      enterPassword: 'Введите пароль',
      loginError: 'Ошибка входа',
      noAccount: 'Нет аккаунта?',
      register: 'Регистрация',
      createAccount: 'Создайте аккаунт',
      enterName: 'Введите ФИО',
      min8chars: 'Минимум 8 символов',
      confirmPassword: 'Подтвердите пароль',
      repeatPassword: 'Повторите пароль',
      passwordsNotMatch: 'Пароли не совпадают',
      emailMustBeDvfu: 'Email должен быть @dvfu.ru',
      registrationSuccess: 'Аккаунт создан! Перенаправление на страницу входа...',
      registrationError: 'Ошибка регистрации',
      hasAccount: 'Уже есть аккаунт?',
      
      // Validation
      conflict: 'Пересечение с бронью',
      maxDuration: 'Максимум 8 часов',
      selectTime: 'Выберите время',
      
      // 24/7
      roundTheClock: 'Круглосуточно',
      workingHours: '09:00 - 21:00',
    },
    en: {
      // Header
      admin: 'Admin',
      adminPanel: 'Admin',
      logout: 'Logout',
      login: 'Login',
      
      // Index page
      bookingTitle: 'FEFU Coworking Booking',
      selectRoom: 'select a room for work or meeting',
      authRequired: 'Authorization required',
      loginToBook: 'To book, please login',
      selectBuilding: 'Select building:',
      allBuildings: 'All buildings',
      building: 'Building',
      floor: 'Floor',
      availableRooms: 'Available rooms',
      noRooms: 'No rooms available',
      capacity: 'up to',
      people: 'people',
      now: 'Now',
      free: 'Free',
      busy: 'Busy',
      until: 'until',
      selectTimeBtn: 'Select time',
      nextBooking: 'Next booking',
      freeNow: 'Free now',
      
      // Room page
      backToList: 'Back to rooms',
      room: 'Room',
      selectDate: 'Date',
      startTime: 'Start',
      endTime: 'End',
      duration: 'Duration',
      hours: 'hrs',
      bookingTitleLabel: 'Title (booking purpose)',
      bookingPlaceholder: 'e.g., Exam preparation',
      book: 'Book',
      bookingSuccess: 'Booking created successfully!',
      bookingError: 'Booking error',
      schedule: 'Schedule for',
      freeTime: 'Free',
      busyTime: 'Busy',
      noName: 'No name',
      pastTimeError: 'Cannot book past time',
      
      // Admin
      buildings: 'Buildings',
      addBuilding: 'Add building',
      buildingId: 'Building ID',
      floors: 'Floors',
      save: 'Save',
      delete: 'Delete',
      cancel: 'Cancel',
      confirm: 'Confirm',
      rooms: 'Rooms',
      addRoom: 'Add room',
      createRoom: 'Create room',
      roomName: 'Room name',
      roomNameEn: 'Name (EN)',
      roomType: 'Room type',
      amenities: 'Amenities',
      amenitiesHint: 'Comma separated',
      buildingRequired: 'Select building',
      typeRequired: 'Select type',
      noRoomsAdmin: 'No rooms',
      bookings: 'Bookings',
      noBookings: 'No bookings',
      user: 'User',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      active: 'Active',
      cancelled: 'Cancelled',
      allTypes: 'All types',
      
      // Room types
      coworking: 'Coworking',
      meeting: 'Meeting room',
      classroom: 'Classroom',
      lab: 'Laboratory',
      conference: 'Conference hall',

      // Room location types
      library: 'Library',
      studentCenter: 'Student Center',
      science: 'Science Library',
      sports: 'Sports Hall',
      dormitory: 'Dormitory',
      
      // Days
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      
      // Months
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December',
      
      // Login
      welcome: 'Welcome',
      loginSubtitle: 'Login to book',
      studentId: 'Student ID',
      fullName: 'Full Name',
      loginBtn: 'Login',
      demoMode: 'Demo mode: select any user to login',
      email: 'Email',
      password: 'Password',
      enterEmail: 'Enter email',
      enterPassword: 'Enter password',
      loginError: 'Login error',
      noAccount: 'No account?',
      register: 'Register',
      createAccount: 'Create an account',
      enterName: 'Enter your name',
      min8chars: 'Minimum 8 characters',
      confirmPassword: 'Confirm password',
      repeatPassword: 'Repeat password',
      passwordsNotMatch: 'Passwords do not match',
      emailMustBeDvfu: 'Email must be @dvfu.ru',
      registrationSuccess: 'Account created! Redirecting to login...',
      registrationError: 'Registration error',
      hasAccount: 'Already have an account?',
      
      // Validation
      conflict: 'Conflict with booking',
      maxDuration: 'Maximum 8 hours',
      selectTime: 'Select time',
      
      // 24/7
      roundTheClock: '24/7',
      workingHours: '09:00 - 21:00',
    }
  }

  const t = (key: string) => {
    const lang = isRu.value ? 'ru' : 'en'
    return translations[lang][key as keyof typeof translations.ru] || key
  }

  const toggleLang = () => {
    isRu.value = !isRu.value
    if (import.meta.client) {
      localStorage.setItem('lang', isRu.value ? 'ru' : 'en')
    }
  }

  const initLang = () => {
    if (import.meta.client) {
      const savedLang = localStorage.getItem('lang')
      isRu.value = savedLang !== 'en'
    }
  }

  const dayNames = computed(() => 
    isRu.value 
      ? ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  )

  const monthNames = computed(() => 
    isRu.value 
      ? ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  )

  const roomTypes = computed(() => [
    { label: t('coworking'), value: 'coworking' },
    { label: t('meeting'), value: 'meeting' },
    { label: t('classroom'), value: 'classroom' },
    { label: t('lab'), value: 'lab' },
    { label: t('conference'), value: 'conference' }
  ])

  const locationTypes = computed(() => [
    { label: t('library'), value: 'library' },
    { label: t('studentCenter'), value: 'studentCenter' },
    { label: t('science'), value: 'science' },
    { label: t('sports'), value: 'sports' },
    { label: t('dormitory'), value: 'dormitory' }
  ])

  const fetchRoomTypes = async () => {
    try {
      const types = await $fetch<any[]>('/api/roomTypes')
      return types.map(rt => ({
        label: isRu.value ? rt.nameRu : rt.nameEn,
        value: rt.id
      }))
    } catch {
      return roomTypes.value
    }
  }

  const fetchAmenities = async () => {
    try {
      const amenities = await $fetch<any[]>('/api/amenities')
      return amenities.map(a => ({
        label: isRu.value ? a.nameRu : a.nameEn,
        value: a.id
      }))
    } catch {
      return []
    }
  }

  return {
    isRu,
    t,
    toggleLang,
    initLang,
    dayNames,
    monthNames,
    roomTypes,
    locationTypes,
    fetchRoomTypes,
    fetchAmenities
  }
}
