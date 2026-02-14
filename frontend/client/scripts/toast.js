// Toast Notification Module - Temporary notifications
const Toast = (() => {
    let toastContainer = null;

    // Initialize toast container
    const initContainer = () => {
        if (!toastContainer) {
            toastContainer = Utils.createElement('div', 'toast-container');
            document.body.appendChild(toastContainer);
        }
        return toastContainer;
    };

    // Show toast notification
    const show = (message, type = 'info', duration = 3000) => {
        const container = initContainer();
        const id = 'toast-' + Date.now();

        const toastHTML = `
            <div class="toast toast-${type}" id="${id}">
                <div class="toast-content">
                    <span class="toast-icon">
                        ${getIcon(type)}
                    </span>
                    <span class="toast-message">${message}</span>
                </div>
                <button class="toast-close" data-close-toast>${getCloseIcon()}</button>
            </div>
        `;

        const temp = document.createElement('div');
        temp.innerHTML = toastHTML;
        const toast = temp.firstElementChild;
        container.appendChild(toast);

        // Setup close button
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => close(id));
        }

        // Auto close
        if (duration > 0) {
            setTimeout(() => close(id), duration);
        }

        // Fade in
        Utils.fadeIn(toast);

        return id;
    };

    // Show success toast
    const success = (message, duration = 3000) => {
        return show(message, 'success', duration);
    };

    // Show error toast
    const error = (message, duration = 3000) => {
        return show(message, 'error', duration);
    };

    // Show warning toast
    const warning = (message, duration = 3000) => {
        return show(message, 'warning', duration);
    };

    // Show info toast
    const info = (message, duration = 3000) => {
        return show(message, 'info', duration);
    };

    // Close toast
    const close = (id) => {
        const toast = document.getElementById(id);
        if (toast) {
            Utils.fadeOut(toast, 300);
            setTimeout(() => toast.remove(), 300);
        }
    };

    // Close all toasts
    const closeAll = () => {
        if (toastContainer) {
            toastContainer.querySelectorAll('.toast').forEach(toast => {
                Utils.fadeOut(toast, 300);
            });
            setTimeout(() => {
                toastContainer.innerHTML = '';
            }, 300);
        }
    };

    // Get icon based on type
    const getIcon = (type) => {
        const icons = {
            success: '<span class="material-symbols-outlined">check_circle</span>',
            error: '<span class="material-symbols-outlined">error</span>',
            warning: '<span class="material-symbols-outlined">warning</span>',
            info: '<span class="material-symbols-outlined">info</span>'
        };
        return icons[type] || icons.info;
    };

    // Get close icon
    const getCloseIcon = () => {
        return '<span class="material-symbols-outlined">close</span>';
    };

    return {
        show,
        success,
        error,
        warning,
        info,
        close,
        closeAll
    };
})();
