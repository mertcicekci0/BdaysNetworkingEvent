class App {
    static initialize() {
        this.checkRegistration();
        this.setupServiceWorker();
        this.setupLogout();
    }

    static checkRegistration() {
        if (StorageManager.isRegistered()) {
            document.getElementById('registration-modal').classList.remove('active');
            document.getElementById('app').classList.remove('hidden');
        }
    }

    static setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('ServiceWorker registration successful');
                }).catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    }

    static setupLogout() {
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.handleLogout());
        }
    }

    static handleLogout() {
        if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
            // Stop QR scanner
            QRManager.stopScanner();
            
            // Clear user data
            StorageManager.clearAll();
            
            // Reset UI
            document.getElementById('app').classList.add('hidden');
            document.getElementById('registration-modal').classList.add('active');
            
            // Clear form inputs
            const form = document.getElementById('registration-form');
            if (form) {
                form.reset();
            }

            // Show notification
            NotificationManager.success('Başarıyla çıkış yapıldı');
        }
    }

    static resetApp() {
        if (confirm('Tüm veriler silinecek. Emin misiniz?')) {
            StorageManager.clearAll();
            QRManager.stopScanner();
            window.location.reload();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.initialize();
}); 