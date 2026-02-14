// Program Page Module - Handle dynamic program content
const ProgramPage = (() => {
    const programs = [];
    let currentFilter = 'all';

    // Initialize program page
    const init = () => {
        console.log('📚 Program page initialized');
        loadPrograms();
        setupEventListeners();
    };

    // Load programs from API
    const loadPrograms = async () => {
        try {
            const result = await API.programs.getAll();

            if (result.success) {
                programs.length = 0;
                programs.push(...result.data);
                renderPrograms();
                Toast.success('Programs loaded successfully');
            } else {
                console.error('Failed to load programs:', result.error);
                // Show static programs as fallback
                console.error('Failed to load programs:', result.error);
                renderError();
            }
        } catch (error) {
            console.error('Error loading programs:', error);
            renderError();
        }
    };

    // Render error state
    const renderError = () => {
        const container = document.querySelector('[data-programs]');
        if (!container) return;

        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-600">Failed to load programs. Please try again later.</p>
            </div>
        `;
    };

    // Render programs dynamically
    const renderPrograms = () => {
        const container = document.querySelector('[data-programs]');
        if (!container) return;

        const filteredPrograms = currentFilter === 'all'
            ? programs
            : programs.filter(p => p.category === currentFilter);

        if (filteredPrograms.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-600">No programs available at the moment.</p>
                </div>
            `;
            return;
        }

        const html = filteredPrograms.map(program => `
            <div class="border-2 border-slate-800 rounded-[2rem] p-8 flex flex-col" data-program="${program.id}" data-category="${program.category}">
                <h3 class="text-2xl font-bold mb-4 text-[var(--primary-blue)]">${program.title}</h3>
                <div class="w-40 h-40 border-2 border-slate-800 diamond-clip mb-6 p-1 mx-auto">
                    <img class="w-full h-full object-cover diamond-clip" src="${program.image}" alt="${program.title}" />
                </div>
                <p class="text-slate-700 mb-6 flex-grow">${program.description}</p>
                <div class="space-y-2 mb-6">
                    ${program.features.map(feature => `
                        <p class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-[var(--primary-green)]">check_circle</span>
                            <span>${feature}</span>
                        </p>
                    `).join('')}
                </div>
                <button class="w-full bg-[var(--primary-blue)] text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold" data-action="enroll" data-program="${program.id}">
                    Enroll Now
                </button>
            </div>
        `).join('');

        container.innerHTML = html;
        setupProgramEventListeners();
    };

    // Setup event listeners for programs
    const setupProgramEventListeners = () => {
        document.querySelectorAll('[data-action="enroll"]').forEach(btn => {
            btn.addEventListener('click', handleEnrollClick);
        });
    };

    // Handle enroll button click
    const handleEnrollClick = async (e) => {
        const programId = e.target.dataset.program;
        const program = programs.find(p => p.id == programId);

        if (!program) return;

        // Check if user is logged in
        const token = API.getToken();
        if (!token) {
            // Show login modal or redirect
            Toast.warning('Please log in to enroll');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        // Show enrollment form modal
        showEnrollModal(program);
    };

    // Show enrollment form modal
    const showEnrollModal = (program) => {
        const id = 'enroll-modal';

        const content = `
            <form id="enroll-form" data-program="${program.id}">
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Program</label>
                    <input type="text" class="w-full px-4 py-2 border border-slate-300 rounded-lg" value="${program.title}" disabled />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                    <input type="text" name="name" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)]" required />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                    <input type="email" name="email" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)]" required />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                    <input type="tel" name="phone" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)]" required />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Experience Level *</label>
                    <select name="level" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)]" required>
                        <option value="">Select level...</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Additional Message</label>
                    <textarea name="message" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)]" rows="3"></textarea>
                </div>
            </form>
        `;

        Modal.create(id, {
            title: 'Enroll in Program',
            content: content,
            buttons: [
                {
                    text: 'Cancel',
                    action: 'cancel',
                    class: 'btn-secondary'
                },
                {
                    text: 'Enroll',
                    action: 'enroll',
                    class: 'btn-primary'
                }
            ]
        });

        Modal.register(id);
        Modal.open(id);

        // Setup form submission
        const modal = document.getElementById(id);
        const form = modal.querySelector('#enroll-form');
        const buttons = modal.querySelectorAll('.modal-btn');

        buttons.forEach(btn => {
            if (btn.dataset.action === 'enroll') {
                btn.addEventListener('click', () => {
                    if (form.checkValidity()) {
                        submitEnrollment(form, id);
                    } else {
                        Toast.error('Please fill all required fields');
                    }
                });
            }
        });
    };

    // Submit enrollment
    const submitEnrollment = async (form, modalId) => {
        const formData = new FormData(form);
        const data = {
            programId: form.dataset.program,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            level: formData.get('level'),
            message: formData.get('message')
        };

        // Show loading state
        const submitBtn = document.querySelector(`#${modalId} .modal-btn.btn-primary`);
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enrolling...';

        // Simulate API call
        setTimeout(() => {
            Toast.success('Successfully enrolled in the program!');
            Modal.close(modalId);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    };

    // Setup event listeners
    const setupEventListeners = () => {
        // Filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentFilter = e.target.dataset.filter;

                // Update active state
                document.querySelectorAll('[data-filter]').forEach(b => {
                    b.classList.remove('active', 'bg-[var(--primary-blue)]', 'text-white');
                });
                e.target.classList.add('active', 'bg-[var(--primary-blue)]', 'text-white');

                renderPrograms();
            });
        });
    };

    return {
        init,
        loadPrograms,
        renderPrograms
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ProgramPage.init();
    App.init();
});