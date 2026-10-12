// Hobby Tracker App - Main JavaScript

class HobbyTracker {
    constructor() {
        this.hobbies = [];
        this.init();
    }

    init() {
        // Load hobbies from localStorage on startup
        const savedHobbies = localStorage.getItem('hobbies');
        if (savedHobbies) {
            this.hobbies = JSON.parse(savedHobbies);
        }

        // Setup event listeners
        document.getElementById('hobby-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addHobby();
        });

        this.render();
    }

    addHobby() {
        const name = document.getElementById('hobby-name').value.trim();
        const category = document.getElementById('category-select').value;
        const level = parseInt(document.getElementById('level').value);

        if (!name) return;

        const hobby = {
            id: Date.now(),
            name,
            category,
            level,
            streak: 0,
            lastUpdated: new Date().toISOString()
        };

        this.hobbies.push(hobby);
        this.save();
        this.render();

        // Reset form
        document.getElementById('hobby-name').value = '';
        document.getElementById('level').value = '';
    }

    deleteHobby(id) {
        this.hobbies = this.hobbies.filter(h => h.id !== id);
        this.save();
        this.render();
    }

    updateLevel(id, newLevel) {
        const hobby = this.hobbies.find(h => h.id === id);
        if (hobby) {
            hobby.level = Math.min(10, Math.max(1, parseInt(newLevel)));
            hobby.streak += 1;
            hobby.lastUpdated = new Date().toISOString();
            this.save();
            this.render();
        }
    }

    save() {
        localStorage.setItem('hobbies', JSON.stringify(this.hobbies));
    }

    render() {
        const container = document.getElementById('hobby-container');
        
        if (this.hobbies.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#888;">No hobbies yet. Add one above! 🎯</p>';
            return;
        }

        const categoryColors = {
            programming: '#667eea',
            quantum: '#764ba2',
            ml: '#f093fb',
            other: '#f5f5f5'
        };

        container.innerHTML = this.hobbies.map(hobby => `
            <div class="hobby-card" data-id="${hobby.id}">
                <div class="hobby-info">
                    <h3>${this.escapeHtml(hobby.name)}</h3>
                    <p class="hobby-meta">Category: ${this.getCategoryName(hobby.category)} | Level: ${hobby.level}/10</p>
                    <div class="hobby-stats">
                        <span>🔥 Streak: ${hobby.streak} days</span>
                        <span>⏰ Last updated: ${new Date(hobby.lastUpdated).toLocaleDateString()}</span>
                    </div>
                </div>
                <button class="remove-btn" onclick="tracker.deleteHobby(${hobby.id})">Delete</button>
            </div>
        `).join('');
    }

    getCategoryName(cat) {
        const names = { programming: 'Programming', quantum: 'Quantum Computing', ml: 'Machine Learning', other: 'Other' };
        return names[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new HobbyTracker();
});
