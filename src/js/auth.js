// Form validation functions
function validateName(name) {
    return name.length >= 3;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
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
document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    let isValid = true;

    // Clear previous errors first
    clearError(nameInput);
    clearError(emailInput);
    clearError(phoneInput);

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

    // Validate phone
    if (!validatePhone(phoneInput.value.trim())) {
        showError(phoneInput, 'Geçerli bir telefon numarası giriniz (10 haneli)');
        isValid = false;
    }

    if (isValid) {
        // Proceed with form submission
        // Add your form submission logic here
    }
});

// Clear errors when user starts typing
const inputs = document.querySelectorAll('.form-group input');
inputs.forEach(input => {
    input.addEventListener('input', () => clearError(input));
}); 