class ApiService {
    // Yeni kullanıcı kaydet
    static async registerUser(userData) {
        try {
            const response = await fetch(API.WRITE_USER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone || '',
                    linkedin: userData.linkedin || '',
                    linked: userData.linked || []
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Kullanıcı kayıt hatası:', error);
            throw error;
        }
    }

    // ID ile kullanıcı bilgisi al
    static async getUserById(userId) {
        try {
            const response = await fetch(`${API.READ_USER}?id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Kullanıcı bilgisi alma hatası:', error);
            throw error;
        }
    }

    // İsim ile kullanıcı ara
    static async searchUserByName(name) {
        try {
            const response = await fetch(`${API.READ_USER_BY_NAME}?name=${encodeURIComponent(name)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const searchResults = await response.json();
            return searchResults;
        } catch (error) {
            console.error('Kullanıcı arama hatası:', error);
            throw error;
        }
    }

    // Arkadaş ekle
    static async addFriend(userId, friendId) {
        try {
            const response = await fetch(API.ADD_FRIENDS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id1: userId,
                    id2: friendId
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Arkadaş ekleme hatası:', error);
            throw error;
        }
    }

    // Kullanıcı puanlarını güncelle
    static async updateUserPoints(userId, points) {
        try {
            const userData = await this.getUserById(userId);
            if (!userData) {
                throw new Error('Kullanıcı bulunamadı');
            }
            
            // Kullanıcı verilerini güncelle
            userData.points = points;
            
            // Kullanıcıyı kaydet
            const response = await fetch(API.WRITE_USER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone || '',
                    linkedin: userData.linkedin || '',
                    linked: userData.linked || [],
                    points: points
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Kullanıcı puanı güncelleme hatası:', error);
            throw error;
        }
    }
} 