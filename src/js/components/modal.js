class ModalManager {
    constructor() {
        this.modal = document.getElementById('registration-modal');
        this.form = document.getElementById('registration-form');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Add input validation
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(input.id) {
            case 'email':
                isValid = VALIDATION.EMAIL_REGEX.test(value);
                errorMessage = 'Geçerli bir e-posta adresi giriniz';
                break;
            case 'phone':
                isValid = VALIDATION.PHONE_REGEX.test(value);
                errorMessage = 'Geçerli bir telefon numarası giriniz';
                break;
            case 'linkedin':
                isValid = VALIDATION.LINKEDIN_REGEX.test(value);
                errorMessage = 'Geçerli bir LinkedIn URL\'si giriniz';
                break;
            case 'name':
                isValid = value.length >= 3;
                errorMessage = 'İsim en az 3 karakter olmalıdır';
                break;
        }

        this.toggleError(input, isValid ? '' : errorMessage);
        return isValid;
    }

    toggleError(input, errorMessage) {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (errorMessage) {
            formGroup.classList.add('error');
            if (!existingError) {
                const errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                errorElement.textContent = errorMessage;
                formGroup.appendChild(errorElement);
            } else {
                existingError.textContent = errorMessage;
            }
        } else {
            formGroup.classList.remove('error');
            if (existingError) {
                existingError.remove();
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const inputs = this.form.querySelectorAll('input');
        let isValid = true;

        // Validate all inputs
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            NotificationManager.error('Lütfen tüm alanları doğru şekilde doldurun');
            return;
        }

        const formData = {
            name: this.form.querySelector('#name').value,
            email: this.form.querySelector('#email').value,
            phone: this.form.querySelector('#phone').value,
            linkedin: this.form.querySelector('#linkedin').value,
            points: 0,
            connections: new Set()
        };

        // Save user data
        StorageManager.saveUserData(formData);

        // Add user to leaderboard
        const leaderboard = StorageManager.getLeaderboard();
        leaderboard.push({
            name: formData.name,
            points: formData.points,
            linkedin: formData.linkedin
        });
        StorageManager.saveLeaderboard(leaderboard);

        // Hide modal and show main app
        this.hide();
        document.getElementById('app').classList.remove('hidden');
        
        // Update UI
        ProfileManager.updateProfile();
        QRManager.generateUserQR();
        LeaderboardManager.updateLeaderboard();

        NotificationManager.success('Kayıt başarıyla tamamlandı!');
    }

    show() {
        this.modal.classList.add('active');
    }

    hide() {
        this.modal.classList.remove('active');
    }
}

// Initialize modal manager
const modalManager = new ModalManager(); 