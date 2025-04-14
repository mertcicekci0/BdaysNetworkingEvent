class StorageManager {
    static saveUserData(userData) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }

    static getUserData() {
        const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    }

    static saveConnections(connections) {
        localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(Array.from(connections)));
    }

    static getConnections() {
        const connections = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
        return connections ? new Set(JSON.parse(connections)) : new Set();
    }

    static saveLeaderboard(leaderboardData) {
        localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboardData));
    }

    static getLeaderboard() {
        const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
        return data ? JSON.parse(data) : [];
    }

    static clearAll() {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);
        localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    }

    static isRegistered() {
        return !!this.getUserData();
    }
}

// Mock data for initial leaderboard
const mockLeaderboardData = [
    { name: "Ali Yılmaz", points: 50, linkedin: "https://linkedin.com/in/aliyilmaz" },
    { name: "Ayşe Demir", points: 40, linkedin: "https://linkedin.com/in/aysedemir" },
    { name: "Mehmet Kaya", points: 30, linkedin: "https://linkedin.com/in/mehmetkaya" },
    { name: "Zeynep Şahin", points: 25, linkedin: "https://linkedin.com/in/zeynepsahin" },
    { name: "Can Özkan", points: 20, linkedin: "https://linkedin.com/in/canozkan" }
];

// Initialize leaderboard with mock data if it doesn't exist
if (!StorageManager.getLeaderboard().length) {
    StorageManager.saveLeaderboard(mockLeaderboardData);
} 