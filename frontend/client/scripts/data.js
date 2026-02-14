// Data Module - Centralized data management
const Data = (() => {
    const cache = {
        programs: [],
        services: [],
        events: [],
        blog: [],
        metrics: null,
        lastUpdated: {}
    };

    // Cache duration in milliseconds (5 minutes)
    const CACHE_DURATION = 5 * 60 * 1000;

    // Check if cache is valid
    const isCacheValid = (key) => {
        const lastUpdate = cache.lastUpdated[key];
        if (!lastUpdate) return false;
        return Date.now() - lastUpdate < CACHE_DURATION;
    };

    // Load programs
    const loadPrograms = async (forceRefresh = false) => {
        if (!forceRefresh && cache.programs.length > 0 && isCacheValid('programs')) {
            return { success: true, data: cache.programs };
        }

        const result = await API.programs.getAll();
        if (result.success) {
            cache.programs = result.data || [];
            cache.lastUpdated.programs = Date.now();
        }
        return result;
    };

    // Load services
    const loadServices = async (forceRefresh = false) => {
        if (!forceRefresh && cache.services.length > 0 && isCacheValid('services')) {
            return { success: true, data: cache.services };
        }

        const result = await API.services.getAll();
        if (result.success) {
            cache.services = result.data || [];
            cache.lastUpdated.services = Date.now();
        }
        return result;
    };

    // Load events
    const loadEvents = async (forceRefresh = false) => {
        if (!Auth.isLoggedIn()) {
            return { success: false, error: 'Authentication required' };
        }

        if (!forceRefresh && cache.events.length > 0 && isCacheValid('events')) {
            return { success: true, data: cache.events };
        }

        const result = await API.events.getAll();
        if (result.success) {
            cache.events = result.data || [];
            cache.lastUpdated.events = Date.now();
        }
        return result;
    };

    // Load blog posts
    const loadBlog = async (forceRefresh = false) => {
        if (!Auth.isLoggedIn()) {
            return { success: false, error: 'Authentication required' };
        }

        if (!forceRefresh && cache.blog.length > 0 && isCacheValid('blog')) {
            return { success: true, data: cache.blog };
        }

        const result = await API.blog.getAll();
        if (result.success) {
            cache.blog = result.data || [];
            cache.lastUpdated.blog = Date.now();
        }
        return result;
    };

    // Get cached data
    const getPrograms = () => cache.programs;
    const getServices = () => cache.services;
    const getEvents = () => cache.events;
    const getBlog = () => cache.blog;

    // Find single item
    const getProgramById = (id) => cache.programs.find(p => p.id == id);
    const getServiceById = (id) => cache.services.find(s => s.id == id);
    const getEventById = (id) => cache.events.find(e => e.id == id);
    const getBlogById = (id) => cache.blog.find(b => b.id == id);

    // Clear cache
    const clearCache = () => {
        cache.programs = [];
        cache.services = [];
        cache.events = [];
        cache.blog = [];
        cache.metrics = null;
        cache.lastUpdated = {};
    };

    // Create program
    const createProgram = async (programData) => {
        const result = await API.programs.create(programData);
        if (result.success) {
            cache.programs.push(result.data);
        }
        return result;
    };

    // Update program
    const updateProgram = async (id, programData) => {
        const result = await API.programs.update(id, programData);
        if (result.success) {
            const index = cache.programs.findIndex(p => p.id == id);
            if (index !== -1) {
                cache.programs[index] = result.data;
            }
        }
        return result;
    };

    // Delete program
    const deleteProgram = async (id) => {
        const result = await API.programs.delete(id);
        if (result.success) {
            cache.programs = cache.programs.filter(p => p.id != id);
        }
        return result;
    };

    // Create service
    const createService = async (serviceData) => {
        const result = await API.services.create(serviceData);
        if (result.success) {
            cache.services.push(result.data);
        }
        return result;
    };

    // Update service
    const updateService = async (id, serviceData) => {
        const result = await API.services.update(id, serviceData);
        if (result.success) {
            const index = cache.services.findIndex(s => s.id == id);
            if (index !== -1) {
                cache.services[index] = result.data;
            }
        }
        return result;
    };

    // Delete service
    const deleteService = async (id) => {
        const result = await API.services.delete(id);
        if (result.success) {
            cache.services = cache.services.filter(s => s.id != id);
        }
        return result;
    };

    // Create event
    const createEvent = async (eventData) => {
        const result = await API.events.create(eventData);
        if (result.success) {
            cache.events.push(result.data);
        }
        return result;
    };

    // Update event
    const updateEvent = async (id, eventData) => {
        const result = await API.events.update(id, eventData);
        if (result.success) {
            const index = cache.events.findIndex(e => e.id == id);
            if (index !== -1) {
                cache.events[index] = result.data;
            }
        }
        return result;
    };

    // Delete event
    const deleteEvent = async (id) => {
        const result = await API.events.delete(id);
        if (result.success) {
            cache.events = cache.events.filter(e => e.id != id);
        }
        return result;
    };

    return {
        loadPrograms,
        loadServices,
        loadEvents,
        loadBlog,
        getPrograms,
        getServices,
        getEvents,
        getBlog,
        getProgramById,
        getServiceById,
        getEventById,
        getBlogById,
        createProgram,
        updateProgram,
        deleteProgram,
        createService,
        updateService,
        deleteService,
        createEvent,
        updateEvent,
        deleteEvent,
        clearCache
    };
})();
