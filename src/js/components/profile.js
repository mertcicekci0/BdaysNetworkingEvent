class ProfileManager {
    static elements = {
        name: document.getElementById('display-name'),
        email: document.getElementById('display-email'),
        phone: document.getElementById('display-phone'),
        linkedin: document.getElementById('display-linkedin'),
        points: document.getElementById('display-points'),
        editButton: document.getElementById('edit-profile')
    };

    static initialize() {
        this.setupEventListeners();
        this.updateProfile();
    }

    static setupEventListeners() {
        this.elements.editButton.addEventListener('click', () => {
            this.showEditModal();
        });
    }

    static updateProfile() {
        const userData = StorageManager.getUserData();
        if (!userData) return;

        this.elements.name.textContent = userData.name;
        this.elements.email.textContent = userData.email;
        this.elements.phone.textContent = userData.phone;
        this.elements.linkedin.href = userData.linkedin;
        this.elements.linkedin.textContent = userData.linkedin;
        this.elements.points.textContent = userData.points;
    }

    static showEditModal() {
        const userData = StorageManager.getUserData();
        if (!userData) return;

        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Profili Düzenle</h2>
                <form id="edit-profile-form">
                    <div class="form-group">
                        <label for="edit-name">Ad Soyad</label>
                        <input type="text" id="edit-name" value="${userData.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-email">E-posta</label>
                        <input type="email" id="edit-email" value="${userData.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-phone">Telefon Numarası</label>
                        <input type="tel" id="edit-phone" value="${userData.phone}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-linkedin">LinkedIn URL</label>
                        <input type="url" id="edit-linkedin" value="${userData.linkedin}" required>
                    </div>
                    <div class="button-group">
                        <button type="submit" class="btn btn-primary">Kaydet</button>
                        <button type="button" class="btn btn-secondary" id="cancel-edit">İptal</button>
                    </div>
                </form>
            </div>
        `;

        // Add modal to document
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 0);

        // Setup event listeners
        const form = modal.querySelector('#edit-profile-form');
        const cancelButton = modal.querySelector('#cancel-edit');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(form, modal);
        });

        cancelButton.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
    }

    static handleProfileUpdate(form, modal) {
        const updatedData = {
            ...StorageManager.getUserData(),
            name: form.querySelector('#edit-name').value,
            email: form.querySelector('#edit-email').value,
            phone: form.querySelector('#edit-phone').value,
            linkedin: form.querySelector('#edit-linkedin').value
        };

        // Update user data
        StorageManager.saveUserData(updatedData);

        // Update leaderboard
        const leaderboard = StorageManager.getLeaderboard();
        const userIndex = leaderboard.findIndex(user => user.email === updatedData.email);
        if (userIndex !== -1) {
            leaderboard[userIndex] = {
                name: updatedData.name,
                points: updatedData.points,
                linkedin: updatedData.linkedin
            };
            StorageManager.saveLeaderboard(leaderboard);
        }

        // Update UI
        this.updateProfile();
        LeaderboardManager.updateLeaderboard();

        // Close modal
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);

        NotificationManager.success('Profil başarıyla güncellendi!');
    }

    static updatePoints(points) {
        const userData = StorageManager.getUserData();
        if (!userData) return;

        userData.points = points;
        StorageManager.saveUserData(userData);
        this.updateProfile();

        // Update leaderboard
        const leaderboard = StorageManager.getLeaderboard();
        const userIndex = leaderboard.findIndex(user => user.email === userData.email);
        if (userIndex !== -1) {
            leaderboard[userIndex].points = points;
            StorageManager.saveLeaderboard(leaderboard);
            LeaderboardManager.updateLeaderboard();
        }
    }
}

// Initialize profile manager
ProfileManager.initialize(); 