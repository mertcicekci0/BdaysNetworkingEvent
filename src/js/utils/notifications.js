class NotificationManager {
    static container = document.getElementById('notification-container');

    static show(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} fade-in`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;

        this.container.appendChild(notification);

        // Add slide-in animation
        notification.style.cssText = `
            background-color: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-md);
            margin-bottom: var(--spacing-sm);
            position: relative;
            animation: slideInRight 0.3s ease-out;
        `;

        // Remove notification after duration
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            notification.addEventListener('animationend', () => {
                notification.remove();
            });
        }, ANIMATION.NOTIFICATION_DURATION);
    }

    static success(message) {
        this.show(message, 'success');
    }

    static error(message) {
        this.show(message, 'error');
    }
}

// Add necessary keyframes to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style); 