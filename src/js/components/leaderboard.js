class LeaderboardManager {
    static container = document.getElementById('leaderboard-list');

    static initialize() {
        this.updateLeaderboard();
        this.setupAutoRefresh();
    }

    static setupAutoRefresh() {
        // Update leaderboard every minute
        setInterval(() => {
            this.updateLeaderboard();
        }, ANIMATION.LEADERBOARD_UPDATE);
    }

    static updateLeaderboard() {
        const leaderboard = StorageManager.getLeaderboard();
        
        // Sort by points in descending order
        leaderboard.sort((a, b) => b.points - a.points);

        // Clear current leaderboard
        this.container.innerHTML = '';

        // Add new items with staggered animation
        leaderboard.forEach((user, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.style.animationDelay = `${index * 0.1}s`;

            item.innerHTML = `
                <span class="rank ${index < 3 ? 'top-' + (index + 1) : ''}">#${index + 1}</span>
                <div class="user-info">
                    <strong>${user.name}</strong>
                    <a href="${user.linkedin}" target="_blank" rel="noopener noreferrer">
                        LinkedIn Profili
                    </a>
                </div>
                <span class="points">${user.points} puan</span>
            `;

            this.container.appendChild(item);
        });

        // Add empty state if no users
        if (leaderboard.length === 0) {
            this.container.innerHTML = `
                <div class="leaderboard-empty">
                    <p>Henüz katılımcı bulunmuyor</p>
                </div>
            `;
        }
    }

    static addUser(userData) {
        const leaderboard = StorageManager.getLeaderboard();
        
        // Check if user already exists
        const existingUserIndex = leaderboard.findIndex(user => user.email === userData.email);
        
        if (existingUserIndex !== -1) {
            // Update existing user
            leaderboard[existingUserIndex] = {
                name: userData.name,
                points: userData.points,
                linkedin: userData.linkedin
            };
        } else {
            // Add new user
            leaderboard.push({
                name: userData.name,
                points: userData.points,
                linkedin: userData.linkedin
            });
        }

        StorageManager.saveLeaderboard(leaderboard);
        this.updateLeaderboard();
    }

    static updateUserPoints(email, points) {
        const leaderboard = StorageManager.getLeaderboard();
        const userIndex = leaderboard.findIndex(user => user.email === email);
        
        if (userIndex !== -1) {
            leaderboard[userIndex].points = points;
            StorageManager.saveLeaderboard(leaderboard);
            this.updateLeaderboard();
        }
    }

    static getTopUsers(count = 3) {
        const leaderboard = StorageManager.getLeaderboard();
        return leaderboard
            .sort((a, b) => b.points - a.points)
            .slice(0, count);
    }

    static getUserRank(email) {
        const leaderboard = StorageManager.getLeaderboard();
        const sortedLeaderboard = leaderboard.sort((a, b) => b.points - a.points);
        return sortedLeaderboard.findIndex(user => user.email === email) + 1;
    }
}

// Initialize leaderboard manager
LeaderboardManager.initialize(); 