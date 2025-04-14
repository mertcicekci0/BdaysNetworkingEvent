// Storage Keys
const STORAGE_KEYS = {
    USER_DATA: 'networkingEvent_userData',
    CONNECTIONS: 'networkingEvent_connections',
    LEADERBOARD: 'networkingEvent_leaderboard'
};

// Points System
const POINTS = {
    NEW_CONNECTION: 10,
    BONUS_FIRST_FIVE: 20,
    BONUS_FIRST_TEN: 50
};

// QR Scanner Config
const QR_CONFIG = {
    fps: 10,
    qrbox: 250,
    aspectRatio: 1.0
};

// Animation Durations
const ANIMATION = {
    NOTIFICATION_DURATION: 3000,
    LEADERBOARD_UPDATE: 1000
};

// API Endpoints (if needed in the future)
const API = {
    QR_GENERATOR: 'https://api.qrserver.com/v1/create-qr-code/'
};

// Validation Rules
const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[0-9]{10,11}$/,
    LINKEDIN_REGEX: /^https:\/\/[w]{0,3}\.?linkedin\.com\/.*$/
}; 