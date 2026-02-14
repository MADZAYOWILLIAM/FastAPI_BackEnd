// Service Page Module
const ServicePage = (() => {
    // Initialize
    const init = () => {
        console.log('🛠️ Service page initialized');
        loadServices();
        setupEventListeners();
    };

    // Load services from API
    const loadServices = async () => {
        try {
            const result = await API.services.getAll();

            if (result.success) {
                renderServices(result.data);
            } else {
                console.error('Failed to load services:', result.error);
                renderError();
            }
        } catch (error) {
            console.error('Error loading services:', error);
            renderError();
        }
    };

    // Render services
    const renderServices = (services) => {
        const container = document.querySelector('[data-services]');
        if (!container) return;

        if (services.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-600">No services available at the moment.</p>
                </div>
            `;
            return;
        }

        const html = services.map(service => `
            <div class="border-2 border-slate-800 rounded-[2rem] p-8 flex flex-col">
                <h3 class="text-2xl font-bold mb-4 text-[var(--primary-blue)]">${service.name}</h3>
                <div class="w-40 h-40 border-2 border-slate-800 diamond-clip mb-6 p-1 mx-auto">
                    <img class="w-full h-full object-cover diamond-clip"
                        src="${service.image_url || 'https://via.placeholder.com/300'}" 
                        alt="${service.name}" />
                </div>
                <p class="text-slate-700 mb-6 flex-grow">
                    ${service.description}
                </p>
                <div class="mb-4">
                     <span class="text-2xl font-bold text-slate-900">$${service.price}</span>
                </div>
                 <div class="space-y-2 mb-6">
                    <!-- Placeholder features since schema doesn't have them yet -->
                    <p class="flex items-center gap-2"><span class="material-symbols-outlined text-[var(--primary-green)]">check_circle</span> <span>Professional Service</span></p>
                    <p class="flex items-center gap-2"><span class="material-symbols-outlined text-[var(--primary-green)]">check_circle</span> <span>Expert Consultation</span></p>
                </div>
                <button class="w-full bg-[var(--primary-blue)] text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold" onclick="ServicePage.handleBook('${service.name}')">Book Now</button>
            </div>
        `).join('');

        container.innerHTML = html;
    };

    const renderError = () => {
        const container = document.querySelector('[data-services]');
        if (!container) return;

        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-600">Failed to load services. Please try again later.</p>
            </div>
        `;
    };

    const handleBook = (serviceName) => {
        // Simple booking logic or redirect
        Toast.info(`Booking feature for ${serviceName} coming soon!`);
    };

    const setupEventListeners = () => {
        // Any specific event listeners
    };

    return {
        init,
        handleBook
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ServicePage.init();
    App.init(); // Initialize global app logic if any
});
