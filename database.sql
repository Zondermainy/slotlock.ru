-- Database: slotlock
-- Run as postgres user

-- Create database (run as postgres):
-- CREATE DATABASE slotlock;

-- Connect to database:
-- \c slotlock

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    strikes INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create buildings table
CREATE TABLE IF NOT EXISTS buildings (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    floors INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create room_types table
CREATE TABLE IF NOT EXISTS room_types (
    id VARCHAR(50) PRIMARY KEY,
    name_ru VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create amenities table
CREATE TABLE IF NOT EXISTS amenities (
    id VARCHAR(50) PRIMARY KEY,
    name_ru VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) REFERENCES room_types(id),
    building VARCHAR(10) REFERENCES buildings(id),
    floor INTEGER NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    amenities TEXT[], -- Array of amenity IDs
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(100) PRIMARY KEY,
    room_id VARCHAR(50) REFERENCES rooms(id),
    user_id INTEGER REFERENCES users(id),
    user_name VARCHAR(255),
    title VARCHAR(255),
    booking_date DATE NOT NULL,
    start_time VARCHAR(5) NOT NULL, -- HH:MM format
    end_time VARCHAR(5) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_room_date ON bookings(room_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_rooms_building ON rooms(building);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(type);

-- Insert initial data for room_types
INSERT INTO room_types (id, name_ru, name_en) VALUES 
    ('coworking', 'Коворкинг', 'Coworking'),
    ('meeting', 'Переговорная', 'Meeting room'),
    ('classroom', 'Аудитория', 'Classroom'),
    ('lab', 'Лаборатория', 'Laboratory'),
    ('conference', 'Конференц-зал', 'Conference hall')
ON CONFLICT (id) DO NOTHING;

-- Insert initial data for amenities
INSERT INTO amenities (id, name_ru, name_en) VALUES 
    ('wifi', 'Wi-Fi', 'Wi-Fi'),
    ('power', 'Розетки', 'Power outlets'),
    ('printer', 'Принтер', 'Printer'),
    ('projector', 'Проектор', 'Projector'),
    ('whiteboard', 'Маркерная доска', 'Whiteboard'),
    ('ac', 'Кондиционер', 'Air conditioning'),
    ('quiet', 'Тихая зона', 'Quiet zone'),
    ('food', 'Можно с едой', 'Food allowed')
ON CONFLICT (id) DO NOTHING;

-- Insert initial data for buildings
INSERT INTO buildings (id, name, floors) VALUES 
    ('A', 'Библиотека', 11),
    ('B', 'Медиацентр', 5),
    ('S', 'Студенческий центр', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert initial data for users (passwords are hashed with bcryptjs)
-- Note: Run seed-admin.ts script after deployment to create admin user
INSERT INTO users (email, password, name, role, strikes, is_blocked) VALUES 
    ('ivanov.i@student.dvfu.ru', '$2a$10$rXnLqJZpN6ZxJXGQx0GxEe5EHsGxNQz5nYkQrZm0mXqKkF8.YFz9y', 'Иван Иванов', 'user', 0, FALSE),
    ('petrova.m@student.dvfu.ru', '$2a$10$rXnLqJZpN6ZxJXGQx0GxEe5EHsGxNQz5nYkQrZm0mXqKkF8.YFz9y', 'Мария Петрова', 'user', 0, FALSE),
    ('admin@dvfu.ru', '$2a$10$rXnLqJZpN6ZxJXGQx0GxEe5EHsGxNQz5nYkQrZm0mXqKkF8.YFz9y', 'Админ Библиотеки', 'admin', 0, FALSE)
ON CONFLICT (email) DO NOTHING;

-- Insert initial data for rooms
INSERT INTO rooms (id, name, type, building, floor, location, capacity, amenities, is_active) VALUES 
    ('A11-01', 'Коворкинг ''У окна''', 'coworking', 'A', 11, 'А11, Библиотека', 4, ARRAY['wifi', 'power'], TRUE),
    ('A11-02', 'Переговорка ''Остров''', 'meeting', 'A', 11, 'А11, Библиотека', 6, ARRAY['wifi', 'power', 'whiteboard', 'projector'], TRUE),
    ('B02-01', 'Коворкинг ''Медиа''', 'coworking', 'B', 2, 'B, Медиацентр', 8, ARRAY['wifi', 'power', 'projector'], TRUE),
    ('S01-01', 'Коворкинг ''Студенческий''', 'coworking', 'S', 1, 'S, Студенческий центр', 12, ARRAY['wifi', 'power', 'quiet'], TRUE)
ON CONFLICT (id) DO NOTHING;
