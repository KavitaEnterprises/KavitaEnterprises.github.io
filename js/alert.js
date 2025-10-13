// Modern Alert/Toast Notification System
const Alert = {
    container: null,
    
    init() {
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'alert-container';
            this.container.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4 space-y-3';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', duration = 10000) {
        this.init();
        
        const alertId = `alert-${Date.now()}`;
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        
        const colors = {
            success: 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-600',
            error: 'bg-gradient-to-r from-red-500 to-rose-500 border-red-600',
            warning: 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-600',
            info: 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-600'
        };
        
        const alert = document.createElement('div');
        alert.id = alertId;
        alert.className = `${colors[type]} border-2 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slide-up backdrop-blur-sm relative overflow-hidden`;
        alert.style.animation = 'slideUp 0.3s ease-out';
        
        alert.innerHTML = `
            <!-- Progress Bar -->
            <div class="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-${duration}" style="width: 100%; animation: progressBar ${duration}ms linear;"></div>
            
            <!-- Icon -->
            <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <span class="material-symbols-rounded text-2xl">${icons[type]}</span>
            </div>
            
            <!-- Message -->
            <div class="flex-1 text-sm font-medium leading-relaxed pt-0.5">
                ${message}
            </div>
            
            <!-- Close Button -->
            <button 
                onclick="Alert.close('${alertId}')" 
                class="flex-shrink-0 w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close alert"
            >
                <span class="material-symbols-rounded text-xl">close</span>
            </button>
        `;
        
        this.container.appendChild(alert);
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.close(alertId);
            }, duration);
        }
        
        return alertId;
    },
    
    close(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.style.animation = 'slideDown 0.3s ease-in';
            setTimeout(() => {
                alert.remove();
                
                // Remove container if empty
                if (this.container && this.container.children.length === 0) {
                    this.container.remove();
                    this.container = null;
                }
            }, 300);
        }
    },
    
    success(message, duration = 10000) {
        return this.show(message, 'success', duration);
    },
    
    error(message, duration = 10000) {
        return this.show(message, 'error', duration);
    },
    
    warning(message, duration = 10000) {
        return this.show(message, 'warning', duration);
    },
    
    info(message, duration = 10000) {
        return this.show(message, 'info', duration);
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
    
    @keyframes progressBar {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }
`;
document.head.appendChild(style);
