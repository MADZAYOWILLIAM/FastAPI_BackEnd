// Modal Module - Handle modal dialogs dynamically
const Modal = (() => {
    const modals = new Map();

    // Create modal dynamically
    const create = (id, options = {}) => {
        const {
            title = 'Modal',
            content = '',
            buttons = [],
            closeButton = true,
            overflow = true
        } = options;

        const modalHTML = `
            <div class="modal" id="${id}" data-modal="${id}">
                <div class="modal-overlay" data-modal-close="${id}"></div>
                <div class="modal-content ${overflow ? '' : 'max-h-screen overflow-y-auto'}">
                    <div class="modal-header">
                        <h2 class="modal-title">${title}</h2>
                        ${closeButton ? '<button class="modal-close" data-close-modal>&times;</button>' : ''}
                    </div>
                    <div class="modal-body">${content}</div>
                    ${buttons.length > 0 ? `
                        <div class="modal-footer">
                            ${buttons.map(btn => `
                                <button class="modal-btn ${btn.class || ''}" data-action="${btn.action}">
                                    ${btn.text}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        modals.set(id, modalHTML);
        return modalHTML;
    };

    // Register modal in DOM
    const register = (id, options = {}) => {
        if (document.getElementById(id)) return;
        
        const html = create(id, options);
        const container = document.querySelector('.modal-container') || document.body;
        
        const temp = document.createElement('div');
        temp.innerHTML = html;
        container.appendChild(temp.firstElementChild);

        setupModalListeners(id);
        return document.getElementById(id);
    };

    // Setup modal event listeners
    const setupModalListeners = (id) => {
        const modal = document.getElementById(id);
        if (!modal) return;

        // Close on overlay click
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => close(id));
        }

        // Close on close button click
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => close(id));
        }

        // Prevent close on content click
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.addEventListener('click', (e) => e.stopPropagation());
        }
    };

    // Open modal
    const open = (id, data = {}) => {
        let modal = document.getElementById(id);
        
        if (!modal) {
            register(id);
            modal = document.getElementById(id);
        }

        if (modal) {
            Utils.fadeIn(modal);
            modal.classList.add('active');
            Utils.addClass(document.body, 'modal-open');

            // Update modal content with data if provided
            if (Object.keys(data).length > 0) {
                updateContent(id, data);
            }
        }
    };

    // Close modal
    const close = (id) => {
        const modal = document.getElementById(id);
        if (modal) {
            Utils.fadeOut(modal);
            modal.classList.remove('active');
            
            // Remove modal-open class if no other modals are open
            const openModals = document.querySelectorAll('.modal.active').length;
            if (openModals === 0) {
                Utils.removeClass(document.body, 'modal-open');
            }
        }
    };

    // Close all modals
    const closeAll = () => {
        document.querySelectorAll('.modal.active').forEach(modal => {
            close(modal.id);
        });
    };

    // Update modal content
    const updateContent = (id, data) => {
        const modal = document.getElementById(id);
        if (!modal) return;

        const body = modal.querySelector('.modal-body');
        if (body && data.content) {
            body.innerHTML = data.content;
        }

        // Fill form fields if data provided
        Object.entries(data).forEach(([key, value]) => {
            const field = modal.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = value;
            }
        });
    };

    // Show confirmation dialog
    const confirm = (title, message) => {
        return new Promise((resolve) => {
            const id = 'confirm-modal-' + Date.now();
            register(id, {
                title,
                content: `<p>${message}</p>`,
                buttons: [
                    {
                        text: 'Cancel',
                        action: 'cancel',
                        class: 'btn-secondary'
                    },
                    {
                        text: 'Confirm',
                        action: 'confirm',
                        class: 'btn-primary'
                    }
                ]
            });

            const modal = document.getElementById(id);
            const buttons = modal.querySelectorAll('.modal-btn');

            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    close(id);
                    setTimeout(() => modal.remove(), 300);
                    resolve(action === 'confirm');
                });
            });

            open(id);
        });
    };

    // Show alert dialog
    const alert = (title, message) => {
        return new Promise((resolve) => {
            const id = 'alert-modal-' + Date.now();
            register(id, {
                title,
                content: `<p>${message}</p>`,
                buttons: [
                    {
                        text: 'OK',
                        action: 'ok',
                        class: 'btn-primary'
                    }
                ]
            });

            const modal = document.getElementById(id);
            const btn = modal.querySelector('.modal-btn');

            btn.addEventListener('click', () => {
                close(id);
                setTimeout(() => modal.remove(), 300);
                resolve();
            });

            open(id);
        });
    };

    return {
        create,
        register,
        open,
        close,
        closeAll,
        updateContent,
        confirm,
        alert
    };
})();
