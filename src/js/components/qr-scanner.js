class QRManager {
    static scanner = null;

    static initialize() {
        this.setupScanner();
        if (StorageManager.isRegistered()) {
            this.generateUserQR();
        }
    }

    static setupScanner() {
        this.scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: QR_CONFIG.fps,
                qrbox: QR_CONFIG.qrbox,
                aspectRatio: QR_CONFIG.aspectRatio,
                rememberLastUsedCamera: true,
            }
        );

        this.scanner.render(this.handleScan.bind(this), this.handleError.bind(this));
    }

    static async handleScan(decodedText) {
        try {
            const scannedData = JSON.parse(decodedText);
            
            // Validate scanned data
            if (!scannedData.userId || !scannedData.name || !scannedData.linkedin) {
                throw new Error('Geçersiz QR kod');
            }

            const userData = StorageManager.getUserData();
            if (!userData) {
                NotificationManager.error('Önce kayıt olmalısınız!');
                return;
            }

            // Check if scanning own QR code
            if (scannedData.userId === btoa(userData.email)) {
                NotificationManager.error('Kendi QR kodunuzu tarayamazsınız!');
                return;
            }

            // Check if already connected
            if (userData.connections.has(scannedData.userId)) {
                NotificationManager.error('Bu kişiyle zaten bağlantı kurdunuz!');
                return;
            }

            // Add connection and update points
            userData.connections.add(scannedData.userId);
            userData.points += POINTS.NEW_CONNECTION;

            // Check for bonus points
            if (userData.connections.size === 5) {
                userData.points += POINTS.BONUS_FIRST_FIVE;
                NotificationManager.success('Tebrikler! İlk 5 bağlantı bonusu kazandınız! +20 puan');
            } else if (userData.connections.size === 10) {
                userData.points += POINTS.BONUS_FIRST_TEN;
                NotificationManager.success('Tebrikler! İlk 10 bağlantı bonusu kazandınız! +50 puan');
            }

            // Save updated user data
            StorageManager.saveUserData(userData);
            StorageManager.saveConnections(userData.connections);

            // Update UI
            ProfileManager.updatePoints(userData.points);
            
            NotificationManager.success(`${scannedData.name} ile bağlantı kuruldu! +${POINTS.NEW_CONNECTION} puan kazandınız!`);

        } catch (error) {
            NotificationManager.error('Geçersiz QR kod: ' + error.message);
        }
    }

    static handleError(error) {
        console.error(error);
    }

    static generateUserQR() {
        const userData = StorageManager.getUserData();
        if (!userData) return;

        const qrData = {
            userId: btoa(userData.email),
            name: userData.name,
            linkedin: userData.linkedin
        };

        const qrUrl = `${API.QR_GENERATOR}?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
        
        const qrContainer = document.getElementById('user-qr');
        const qrImage = document.createElement('img');
        qrImage.src = qrUrl;
        qrImage.alt = 'Your QR Code';
        qrImage.className = 'scale-in';
        
        qrContainer.innerHTML = '';
        qrContainer.appendChild(qrImage);
    }

    static stopScanner() {
        if (this.scanner) {
            this.scanner.clear();
        }
    }

    static restartScanner() {
        this.stopScanner();
        this.setupScanner();
    }
}

// Initialize QR manager
QRManager.initialize(); 