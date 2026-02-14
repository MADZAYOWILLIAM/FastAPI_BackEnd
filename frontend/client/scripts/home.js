// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});

// Home Page Module
const HomePage = (() => {
    const init = async () => {
        console.log('🏠 Home page initialized');
        await loadHomeContent();
        setupEventListeners();
    };

    // Load home page content from backend
    const loadHomeContent = async () => {
        try {
            // Load programs
            const programsResult = await Data.loadPrograms();
            if (programsResult.success) {
                renderPrograms(programsResult.data);
            }

            // Load services
            const servicesResult = await Data.loadServices();
            if (servicesResult.success) {
                renderServices(servicesResult.data);
            }
        } catch (error) {
            console.error('Error loading home content:', error);
        }
    };

    // Render programs section
    const renderPrograms = (programs) => {
        const container = document.querySelector('.programs-container');
        if (!container || !programs || programs.length === 0) return;

        const html = programs.slice(0, 4).map((program, index) => {
            const images = [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_aRbVSvw_BauzlgSea8OfeqD11u5priFC2yX6NniI-WFeG6ln3zCEGt-AJCDkK0JqZt479ESeLBTxmyLCySK4oVtdrIqtsHzjBeYeJ3pKcdi0RbnpR5YsxR4zN8tq0k9TM3wDQADdBuUsg30Zb1sFlguw8F0nKdYr5VbQQQvxSMgmG3qE9qjyEjN_f4QBtfxwXHU-Zau0dt4V85LRoeoxb2NFdMUP2zsddwhtNsXiEgA_ELgPJSCGC8sykUttGFc4eswTOevG7VU',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDVFZKllsWQH1EfLmmQMSF0Db8LzcTTr1lj38Bhf4fQlDTo-wh6OdjA7n1hjMaXLVoXY_gFNXqcWAIHhGZh0zssXn2AvHwCZG41AP2c8vDAtIIhHxZYH4aL3gHrCBGnWSSVoTOVbEEXJ-IssH58DOZXoRKWeIb0sNV2t7YHQHoPhGyVVsV4tTRBH98QGZFDcLqVaK981mfQ04E9ECxrc1CS-5D1tP09GtAP2ATR_DdwARQrmL2TTWk94fIdPH3P_Hls3pr7MkAakIwI',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBDvAc8FWNb4EDnhnp5jH4E0DcGMKzjFzIwWFXtuBP-S6YV30VdZftyzgUtLQYjr4wLcSJiG-0jnUFi8Tka1uSagxzzwSgnxSImUoOGpf3HODeFA6ZjqpsAX9wSeaWDwSYThom3CvBHPzwCyEui5wxKMIrU6I22-5Ih1MZKD8fFwutdSpbVJ_oKZup6DfX3DRUEddsQXgRFu0MSfCkGNwM6tsNFOP5CO3wo6D8_fKMbT9yrX5OQFWh6TwZMpBihUg2Y4fsIYQStA4nU',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuChrAMxx1xrKd3M5u0Ul0qOxpbPenYaXvsScEgsa5ULztsrOL-bUJApJAioRx66ysVNwE6aQIRPXJWOyy1eLdS5wJeI3DlZhaDkicroWFyMR2-ob71ILhR3-iP5NBo4PXyBkJusLNVnuNUEQfqh6UMZGg6nu2gTHYIHYIfIl5BP3aXJn43IyLGO2VIxzjI-CeFJplRV4yFZ0FY4rwKTFJngPDxGDqH_VuiQMmzraYMXb82lH-H3DmnIJqMjDfHLKuyuWWQkCNwftg0G'
            ];

            return `
                <div class="border-2 border-slate-800 rounded-[2rem] p-6 flex flex-col items-center text-center animate-on-scroll slide-up stagger-${index + 1} hover:shadow-lg transition-shadow" data-program-id="${program.id}">
                    <h3 class="text-lg font-bold mb-6">${program.name}</h3>
                    <div class="w-32 h-32 border-2 border-slate-800 diamond-clip mb-6 p-1 animate-on-scroll scale-up">
                        <img class="w-full h-full object-cover diamond-clip" src="${images[index] || images[0]}" alt="${program.name}" />
                    </div>
                    <p class="text-sm text-slate-600 mb-8 px-2">${program.description}</p>
                    <button class="mt-auto flex items-center gap-2 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-wider program-see-more" data-program-id="${program.id}">
                        See More <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
        setupProgramListeners();
    };

    // Render services section
    const renderServices = (services) => {
        const container = document.querySelector('.services-container');
        if (!container || !services || services.length === 0) return;

        const html = services.slice(0, 4).map((service, index) => {
            const images = [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAbqwSV465QZvDVRZTBFh2zyNUd8qrxXphrW9eu0hj02-XVLyO_UwaBCTFmTuH-qnKmMqAxngbbo-6eROqhl3OErSulUEZz-DrtrU5suD7YqZRxrVIrPtulM5NAwlFsJ1FsYwRHmU3LWEQxFaAF1daXF06c_l3M9dUFlkhUp6Bx6vEnPwZhZlwTrUE4Da_wsdpCG0MMCzYNiXbu8vUGfNsJPm95HuQKcD_nh2GSFAESfCkPGzGVPy6gpA9y09IhSxTyqDS8c9jf9h9-',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBZO-uuMD1qdoWs_vyf5C7P60b1hfoeXCCBujz7KlvLRSEnfLLJwRYPAaDO4urJIb1A2w_7Vd0S49Jq1VZWlzOWsIZpNtjZPgHH8Zi7Ldo3hrGqCnl0Cvw6sofezTjj2OPLBvosiEF0sAekH_jVVUzKjMSMksUHyG4b4xZXG0E8qaltgRMzPNTg2wi_gqXflAVFRmdgAWWRYcOro3zue9sRJRctLRY0qlp8VsYyt3xYP9sYt_7zLoMnNQLYt5uU9X9o-Sm0Y-HgakKV',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBbPIFdGU0TxWKzVOLAWwsysbFZPc1NaxBosqLLiSyaOGC1pz_eGhPkQ9PmcRp6oaK_Z9JN0NkzQKo-24nzev4ik9Ew1-Co0DySZtYUWBOSe6y9aUkbwLTgmsyFuXMrOMKzpXsnNTWUMz5Wnm-KmjlpIhqMEWb9Z5jA1ZPSSa6gttTrfLhfxZkdH1ntNoJ-W_kpNWPIMmVwn5OwPViuitgjWkRCr74PJfEJVlouJS751NrLzsocRy-eN9No6uzKYjn6gB_BtBXkSQS7',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAg4hTd89SAco9vX0OOMgMOp8EhIv2S29eHmSVZgNhp5F1rjCbLtgsB9A1dgfugGZq4E5VkGW9mKot0WSoMAq3CjiiMVzB08e5MgCt3_GAhvkwMdIEx3tuMhDPct2_KOg3s4Y9FEbe1AnKXiJrBOliKjoENweoyIufonUfmzGmmu3uQNcEjUwQJKLZ_wbCXmLzt8XDyxivxBM3d6kzrLhAQIDfv25XeCOqm0FgdT7XwNWDwAlzqyAny6ufostL1YXwNb_Az3D5wPB4J'
            ];

            return `
                <div class="border-2 border-slate-800 rounded-[2rem] p-6 flex flex-col items-center text-center animate-on-scroll slide-up stagger-${index + 1} hover:shadow-lg transition-shadow" data-service-id="${service.id}">
                    <h3 class="text-lg font-bold mb-6">${service.name}</h3>
                    <div class="w-32 h-32 border-2 border-slate-800 diamond-clip mb-6 p-1 animate-on-scroll scale-up">
                        <img class="w-full h-full object-cover diamond-clip" src="${service.image || images[index] || images[0]}" alt="${service.name}" />
                    </div>
                    <p class="text-sm text-slate-600 mb-8 px-2">${service.description}</p>
                    <div class="text-xl font-bold text-[var(--primary-blue)] mb-4">$${service.price}</div>
                    <button class="mt-auto flex items-center gap-2 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-wider service-book-btn" data-service-id="${service.id}">
                        Book Now <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
        setupServiceListeners();
    };

    // Setup program event listeners
    const setupProgramListeners = () => {
        document.querySelectorAll('.program-see-more').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const programId = e.target.closest('button').dataset.programId;
                window.location.href = `/pages/program.html?id=${programId}`;
            });
        });
    };

    // Setup service event listeners
    const setupServiceListeners = () => {
        document.querySelectorAll('.service-book-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const serviceId = e.target.closest('button').dataset.serviceId;
                const service = Data.getServiceById(serviceId);
                if (!Auth.requireAuth()) return;
                showServiceBookingModal(service);
            });
        });
    };

    // Show service booking modal
    const showServiceBookingModal = (service) => {
        const id = 'service-booking-modal';
        
        const content = `
            <form id="service-booking-form" data-service-id="${service.id}">
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Service</label>
                    <input type="text" class="w-full px-4 py-2 border border-slate-300 rounded-lg" value="${service.name}" disabled />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Price</label>
                    <input type="text" class="w-full px-4 py-2 border border-slate-300 rounded-lg" value="$${service.price}" disabled />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Preferred Date *</label>
                    <input type="date" name="date" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)]" required />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                    <textarea name="notes" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)]" rows="3"></textarea>
                </div>
            </form>
        `;

        Modal.register(id, {
            title: `Book ${service.name}`,
            content: content,
            buttons: [
                { text: 'Cancel', action: 'cancel', class: 'btn-secondary' },
                { text: 'Book Now', action: 'book', class: 'btn-primary' }
            ]
        });

        Modal.open(id);

        // Setup form submission
        const modal = document.getElementById(id);
        const form = modal.querySelector('#service-booking-form');
        const buttons = modal.querySelectorAll('.modal-btn');

        buttons.forEach(btn => {
            if (btn.dataset.action === 'book') {
                btn.addEventListener('click', () => {
                    if (form.checkValidity()) {
                        submitBooking(form, id);
                    } else {
                        Toast.error('Please fill all required fields');
                    }
                });
            }
        });
    };

    // Submit service booking
    const submitBooking = async (form, modalId) => {
        const formData = new FormData(form);
        
        const submitBtn = document.querySelector(`#${modalId} .modal-btn.btn-primary`);
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Booking...';

        setTimeout(() => {
            Toast.success('Service booking submitted! We will contact you soon.');
            Modal.close(modalId);
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    };

    // Setup event listeners
    const setupEventListeners = () => {
        // Any additional event listeners can be added here
    };

    return {
        init
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await HomePage.init();
    App.init();
});