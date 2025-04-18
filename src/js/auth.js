// Form validation functions
function validateName(name) {
    return name.length >= 3;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    if (!phone || phone.trim() === '') return true; // Opsiyonel alan
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

function validateLinkedIn(linkedin) {
    if (!linkedin || linkedin.trim() === '') return true; // Opsiyonel alan
    const linkedinRegex = VALIDATION.LINKEDIN_REGEX;
    return linkedinRegex.test(linkedin);
}

function showError(inputElement, message) {
    const formGroup = inputElement.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    inputElement.classList.add('error');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('visible');
    }
}

function clearError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    inputElement.classList.remove('error');
    if (errorMessage) {
        errorMessage.classList.remove('visible');
    }
}

// Form submission handler
document.getElementById('registration-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const linkedinInput = document.getElementById('linkedin');
    let isValid = true;

    // Clear previous errors first
    clearError(nameInput);
    clearError(emailInput);
    clearError(phoneInput);
    if (linkedinInput) clearError(linkedinInput);

    // Validate name
    if (!validateName(nameInput.value.trim())) {
        showError(nameInput, 'İsim en az 3 karakter olmalıdır');
        isValid = false;
    }

    // Validate email
    if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Geçerli bir e-posta adresi giriniz');
        isValid = false;
    }

    // Validate phone (opsiyonel)
    if (!validatePhone(phoneInput.value.trim())) {
        showError(phoneInput, 'Geçerli bir telefon numarası giriniz (10 haneli)');
        isValid = false;
    }

    // Validate LinkedIn (opsiyonel)
    if (linkedinInput && !validateLinkedIn(linkedinInput.value.trim())) {
        showError(linkedinInput, 'Geçerli bir LinkedIn profil URL\'si giriniz');
        isValid = false;
    }

    if (isValid) {
        try {
            // Kullanıcı verilerini oluştur
            const userData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim() || '',
                linkedin: linkedinInput ? linkedinInput.value.trim() : '',
                linked: [],
                points: 0
            };
            
            // API'ye kullanıcı kaydet
            const result = await ApiService.registerUser(userData);
            
            if (result && result.id) {
                // API'den gelen ID'yi kullanıcı verilerine ekle
                userData.id = result.id;
                
                // Kullanıcı verilerini yerel depolamaya kaydet
                StorageManager.saveUserData(userData);
                
                // Ana uygulamayı göster
                document.getElementById('registration-modal').classList.remove('active');
                document.getElementById('app').classList.remove('hidden');
                
                // Profil ve liderlik tablosunu güncelle
                if (typeof ProfileManager !== 'undefined') {
                    ProfileManager.updateProfile();
                }
                if (typeof LeaderboardManager !== 'undefined') {
                    LeaderboardManager.addUser(userData);
                }
                
                NotificationManager.success('Kayıt başarılı!');
            } else {
                throw new Error('Sunucu yanıtı geçersiz');
            }
        } catch (error) {
            console.error('Kayıt hatası:', error);
            NotificationManager.error('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
});

// Clear errors when user starts typing
const inputs = document.querySelectorAll('.form-group input');
inputs.forEach(input => {
    input.addEventListener('input', () => clearError(input));
});

// LinkedIn OAuth işlemleri
class LinkedInAuth {
    static init() {
        const loginButton = document.getElementById('linkedin-login');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                console.log('LinkedIn login button clicked');
                IN.User.authorize(() => {
                    console.log('LinkedIn authorization successful');
                    this.handleLinkedInLogin();
                });
            });
        }
    }

    static async handleLinkedInLogin() {
        console.log('Getting LinkedIn profile data');
        IN.API.Profile("me").fields(["id", "firstName", "lastName", "email-address"]).result(async (profiles) => {
            const profile = profiles.values[0];
            console.log('LinkedIn profile data received:', profile);

            // Form alanlarını LinkedIn verileri ile doldur
            document.getElementById('name').value = `${profile.firstName} ${profile.lastName}`;
            document.getElementById('email').value = profile.emailAddress;
            
            try {
                // LinkedIn profil bilgilerini hazırla
                const userData = {
                    name: `${profile.firstName} ${profile.lastName}`,
                    email: profile.emailAddress,
                    phone: document.getElementById('phone').value || '',
                    linkedInId: profile.id,
                    linkedInProfile: {
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        profileId: profile.id
                    },
                    linked: [],
                    points: 0
                };
    
                // API'ye kullanıcı kaydet
                const result = await ApiService.registerUser(userData);
                
                if (result && result.id) {
                    // API'den gelen ID'yi kullanıcı verilerine ekle
                    userData.id = result.id;
                    
                    // Kullanıcı verilerini yerel depolamaya kaydet
                    StorageManager.saveUserData(userData);
                    
                    // Ana uygulamayı göster
                    document.getElementById('registration-modal').classList.remove('active');
                    document.getElementById('app').classList.remove('hidden');
                    
                    // Profil ve liderlik tablosunu güncelle
                    if (typeof ProfileManager !== 'undefined') {
                        ProfileManager.updateProfile();
                    }
                    if (typeof LeaderboardManager !== 'undefined') {
                        LeaderboardManager.addUser(userData);
                    }
                    
                    NotificationManager.success('LinkedIn ile giriş başarılı!');
                } else {
                    throw new Error('Sunucu yanıtı geçersiz');
                }
            } catch (error) {
                console.error('LinkedIn ile kayıt hatası:', error);
                NotificationManager.error('LinkedIn ile kayıt sırasında bir hata oluştu');
            }
        }).error((error) => {
            console.error('LinkedIn profile error:', error);
            NotificationManager.error('LinkedIn profil bilgileri alınamadı');
        });
    }
}

// Initialize LinkedIn Auth
LinkedInAuth.init(); 