class FriendFinder {
    static initialize() {
        this.setupSearchForm();
        this.updateFriendsList();
    }

    static setupSearchForm() {
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleSearchUser.bind(this));
        }
    }

    // Kullanıcı arama işlemi
    static async handleSearchUser(event) {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        
        if (!searchInput || !searchInput.value.trim()) {
            NotificationManager.error('Lütfen bir isim girin');
            return;
        }
        
        const searchName = searchInput.value.trim();
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '<div class="loading">Aranıyor...</div>';
        
        try {
            const searchResults = await ApiService.searchUserByName(searchName);
            this.displaySearchResults(searchResults);
        } catch (error) {
            resultsContainer.innerHTML = '<div class="error">Arama sırasında bir hata oluştu</div>';
            NotificationManager.error('Arama sırasında bir hata oluştu');
        }
    }

    // Arama sonuçlarını görüntüleme
    static displaySearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';
        
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">Sonuç bulunamadı</div>';
            return;
        }
        
        const userData = StorageManager.getUserData();
        if (!userData || !userData.id) {
            NotificationManager.error('Kullanıcı bilgisi bulunamadı');
            return;
        }
        
        const resultsList = document.createElement('ul');
        resultsList.className = 'user-list';
        
        results.forEach(user => {
            if (user.id === userData.id) return; // Kendini sonuçlarda gösterme
            
            const isAlreadyFriend = userData.linked && userData.linked.includes(user.id);
            
            const listItem = document.createElement('li');
            listItem.className = 'user-item';
            
            listItem.innerHTML = `
                <div class="user-info">
                    <h3>${user.name}</h3>
                    ${user.email ? `<p>${user.email}</p>` : ''}
                </div>
                <button class="btn ${isAlreadyFriend ? 'btn-secondary disabled' : 'btn-primary'}" 
                        data-id="${user.id}" 
                        ${isAlreadyFriend ? 'disabled' : ''}>
                    ${isAlreadyFriend ? 'Arkadaş Ekli' : 'Arkadaş Ekle'}
                </button>
            `;
            
            resultsList.appendChild(listItem);
        });
        
        resultsContainer.appendChild(resultsList);
        
        // Arkadaş ekleme butonlarına event listener ekle
        document.querySelectorAll('.user-list .btn-primary').forEach(button => {
            button.addEventListener('click', this.handleAddFriend.bind(this));
        });
    }

    // Arkadaş ekleme işlevi
    static async handleAddFriend(event) {
        const button = event.target;
        const friendId = button.getAttribute('data-id');
        
        const userData = StorageManager.getUserData();
        if (!userData || !userData.id) {
            NotificationManager.error('Kullanıcı bilgisi bulunamadı');
            return;
        }
        
        button.disabled = true;
        button.innerHTML = 'Ekleniyor...';
        
        try {
            const result = await ApiService.addFriend(userData.id, friendId);
            
            if (result.success) {
                // Kullanıcı verilerini güncelle
                if (!userData.linked) userData.linked = [];
                userData.linked.push(friendId);
                
                // Puan güncelle - Kullanıcıya puan ekle
                userData.points = (userData.points || 0) + POINTS.NEW_CONNECTION;
                StorageManager.saveUserData(userData);
                
                // UI güncelle
                button.className = 'btn btn-secondary disabled';
                button.innerHTML = 'Arkadaş Ekli';
                
                // Arkadaş listesini güncelle
                this.updateFriendsList();
                
                // Profil puanını güncelle
                if (ProfileManager) {
                    ProfileManager.updatePoints(userData.points);
                }
                
                // Karşı kullanıcıya da puan ekle
                try {
                    const friendData = await ApiService.getUserById(friendId);
                    if (friendData) {
                        // Arkadaşa puan ekle
                        friendData.points = (friendData.points || 0) + POINTS.NEW_CONNECTION;
                        
                        // Puanı güncelle
                        await ApiService.updateUserPoints(friendId, friendData.points);
                        
                        // Liderlik tablosunu güncelle
                        if (LeaderboardManager) {
                            LeaderboardManager.updateUserPoints(friendData.email, friendData.points);
                        }
                    }
                } catch (error) {
                    console.error('Arkadaş puanı güncellenirken hata:', error);
                }
                
                NotificationManager.success(`Arkadaş başarıyla eklendi! +${POINTS.NEW_CONNECTION} puan kazandınız.`);
            } else {
                button.disabled = false;
                button.innerHTML = 'Arkadaş Ekle';
                NotificationManager.error(result.message || 'Arkadaş eklenirken bir hata oluştu');
            }
        } catch (error) {
            button.disabled = false;
            button.innerHTML = 'Arkadaş Ekle';
            NotificationManager.error('Arkadaş eklenirken bir hata oluştu');
        }
    }

    // Arkadaş listesini güncelleme
    static async updateFriendsList() {
        const friendsContainer = document.getElementById('friends-list');
        if (!friendsContainer) return;
        
        const userData = StorageManager.getUserData();
        if (!userData || !userData.id) {
            friendsContainer.innerHTML = '<div class="message">Kullanıcı bilgisi bulunamadı</div>';
            return;
        }
        
        if (!userData.linked || userData.linked.length === 0) {
            friendsContainer.innerHTML = '<div class="message">Henüz arkadaşınız bulunmamaktadır</div>';
            return;
        }
        
        friendsContainer.innerHTML = '<div class="loading">Arkadaşlar yükleniyor...</div>';
        
        try {
            const friendsList = document.createElement('ul');
            friendsList.className = 'friends-list';
            
            // Her bir arkadaş ID'si için bilgileri al
            for (const friendId of userData.linked) {
                const friendData = await ApiService.getUserById(friendId);
                
                if (friendData) {
                    const listItem = document.createElement('li');
                    listItem.className = 'friend-item';
                    
                    listItem.innerHTML = `
                        <div class="friend-info">
                            <h3>${friendData.name}</h3>
                            ${friendData.email ? `<p>${friendData.email}</p>` : ''}
                            ${friendData.phone ? `<p>${friendData.phone}</p>` : ''}
                        </div>
                    `;
                    
                    friendsList.appendChild(listItem);
                }
            }
            
            friendsContainer.innerHTML = '';
            friendsContainer.appendChild(friendsList);
            
        } catch (error) {
            friendsContainer.innerHTML = '<div class="error">Arkadaş listesi yüklenirken bir hata oluştu</div>';
            console.error('Arkadaş listesi güncellenirken hata:', error);
        }
    }
}

// Initialize the FriendFinder
document.addEventListener('DOMContentLoaded', () => {
    FriendFinder.initialize();
}); 