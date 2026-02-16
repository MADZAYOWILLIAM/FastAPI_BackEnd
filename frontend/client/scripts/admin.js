// Admin Dashboard Module
const AdminDashboard = (() => {
    // State
    const state = {
        programs: [],
        services: [],
        news: [],
        events: [],
        users: []
    };

    // Initialize
    const init = async () => {
        // Check auth - require admin role
        if (!Auth.requireAuth('admin')) return;

        console.log('Admin Dashboard initialized');
        await loadAllData();
        setupEventListeners();
    };

    // Load all data
    const loadAllData = async () => {
        await Promise.all([
            loadPrograms(),
            loadServices(),
            loadNews(),
            loadEvents(),
            loadUsers()
        ]);
        updateStats();
        updateLastUpdated();
    };

    const updateLastUpdated = () => {
        const el = document.querySelector('.text-sm.bg-white\\/80');
        if (el) {
            el.textContent = `last updated ${new Date().toLocaleTimeString()}`;
        }
    };

    // --- Programs ---
    const loadPrograms = async () => {
        const result = await API.programs.getAll();
        if (result.success) {
            state.programs = result.data;
            renderProgramsTable();
        }
    };

    const renderProgramsTable = () => {
        const tbody = document.querySelector('#programs tbody');
        if (!tbody) return;

        tbody.innerHTML = state.programs.map(program => `
            <tr class="hover:bg-slate-50">
                <td class="px-6 py-4">
                    <img src="${program.image_url || 'https://via.placeholder.com/50'}" alt="${program.name}" class="h-10 w-10 object-cover rounded-md inline-block mr-2">
                    <span class="font-semibold text-slate-900">${program.name}</span>
                </td>
                <td class="px-6 py-4 text-slate-600">${program.start_date || ''} to ${program.end_date || ''}</td>
                <td class="px-6 py-4 text-slate-600">0</td> <!-- Enrolled placeholder -->
                <td class="px-6 py-4">
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Active</span>
                </td>
                <td class="px-6 py-4 text-center space-x-2">
                    <button class="text-blue-600 hover:underline font-semibold text-sm" onclick="AdminDashboard.editItem('programs', ${program.id})">Edit</button>
                    <button class="text-red-500 hover:underline font-semibold text-sm" onclick="AdminDashboard.deleteItem('programs', ${program.id})">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="px-6 py-4 text-center text-slate-500">No programs found</td></tr>';
    };

    const handleProgramSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const editId = form.dataset.editId; // Check if we're editing

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const data = {
                name: form.querySelector('input[placeholder*="Leadership"]').value, // Matches "e.g. Leadership Mastery"
                description: form.querySelector('textarea').value,
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
                image_url: form.querySelector('input[type="url"]')?.value || 'https://via.placeholder.com/300'
            };

            let result;
            if (editId) {
                // Update existing program
                result = await API.programs.update(editId, data);
            } else {
                // Create new program
                result = await API.programs.create(data);
            }

            if (result.success) {
                Toast.success(editId ? 'Program updated successfully' : 'Program created successfully');
                closeModal('programModal');
                form.reset();
                delete form.dataset.editId; // Clear edit mode
                await loadPrograms();
                updateStats();
            } else {
                Toast.error(result.error || 'Failed to save program');
            }
        } catch (error) {
            console.error(error);
            Toast.error('An error occurred');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save';
        }
    };

    // --- Services ---
    const loadServices = async () => {
        const result = await API.services.getAll();
        if (result.success) {
            state.services = result.data;
            renderServicesTable();
        }
    };

    const renderServicesTable = () => {
        const tbody = document.querySelector('#services tbody');
        if (!tbody) return;

        tbody.innerHTML = state.services.map(service => `
            <tr class="hover:bg-slate-50">
                <td class="px-6 py-4">
                    <img src="${service.image_url || 'https://via.placeholder.com/50'}" alt="${service.name}" class="h-10 w-10 object-cover rounded-md inline-block mr-2">
                    <span class="font-semibold text-slate-900">${service.name}</span>
                </td>
                <td class="px-6 py-4 text-slate-600">$${service.price}</td>
                <td class="px-6 py-4 text-slate-600">0</td>
                <td class="px-6 py-4">
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Active</span>
                </td>
                <td class="px-6 py-4 text-center space-x-2">
                    <button class="text-blue-600 hover:underline font-semibold text-sm" onclick="AdminDashboard.editItem('services', ${service.id || 0})">Edit</button>
                    <button class="text-red-500 hover:underline font-semibold text-sm" onclick="AdminDashboard.deleteItem('services', ${service.id || 0})">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="px-6 py-4 text-center text-slate-500">No services found</td></tr>';
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const editId = form.dataset.editId;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const data = {
                name: form.querySelector('input[placeholder*="Coaching"]').value, // Matches "e.g. 1:1 Coaching Session"
                description: form.querySelector('textarea').value,
                price: parseFloat(form.querySelector('input[type="number"]').value),
                image_url: form.querySelector('input[type="url"]')?.value || 'https://via.placeholder.com/300'
            };

            let result;
            if (editId) {
                result = await API.services.update(editId, data);
            } else {
                result = await API.services.create(data);
            }

            if (result.success) {
                Toast.success(editId ? 'Service updated successfully' : 'Service created successfully');
                closeModal('serviceModal');
                form.reset();
                delete form.dataset.editId;
                await loadServices();
                updateStats();
            } else {
                Toast.error(result.error || 'Failed to save service');
            }
        } catch (error) {
            console.error(error);
            Toast.error('An error occurred');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save';
        }
    };

    // --- News (Blog) ---
    const loadNews = async () => {
        const result = await API.blog.getAll();
        if (result.success) {
            state.news = result.data;
            renderNewsTable();
        }
    };

    const renderNewsTable = () => {
        const tbody = document.querySelector('#news tbody');
        if (!tbody) return;

        tbody.innerHTML = state.news.map(item => `
            <tr class="hover:bg-slate-50">
                <td class="px-6 py-4">
                    <img src="${item.image_url || 'https://via.placeholder.com/50'}" alt="${item.title}" class="h-10 w-10 object-cover rounded-md inline-block mr-2">
                    <span class="font-semibold text-slate-900">${item.title}</span>
                </td>
                <td class="px-6 py-4 text-slate-600">General</td>
                <td class="px-6 py-4 text-slate-600">${item.owner?.name || 'Admin'}</td>
                <td class="px-6 py-4 text-slate-600">0</td>
                <td class="px-6 py-4 text-center space-x-2">
                    <button class="text-blue-600 hover:underline font-semibold text-sm" onclick="AdminDashboard.editItem('blog', ${item.id})">Edit</button>
                    <button class="text-red-500 hover:underline font-semibold text-sm" onclick="AdminDashboard.deleteItem('blog', ${item.id})">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="px-6 py-4 text-center text-slate-500">No news articles found</td></tr>';
    };

    const handleNewsSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const editId = form.dataset.editId;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const data = {
                title: form.querySelector('input[placeholder="News title"]').value,
                body: form.querySelector('textarea').value,
                image_url: form.querySelector('input[type="url"]')?.value || 'https://via.placeholder.com/300'
            };

            let result;
            if (editId) {
                result = await API.blog.update(editId, data);
            } else {
                result = await API.blog.create(data);
            }

            if (result.success) {
                Toast.success(editId ? 'News updated successfully' : 'News created successfully');
                closeModal('newsModal');
                form.reset();
                delete form.dataset.editId;
                await loadNews();
                updateStats();
            } else {
                Toast.error(result.error || 'Failed to save news');
            }
        } catch (error) {
            console.error(error);
            Toast.error('An error occurred');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save';
        }
    };

    // --- Events ---
    const loadEvents = async () => {
        const result = await API.events.getAll();
        if (result.success) {
            state.events = result.data;
            renderEventsTable();
        }
    };

    const renderEventsTable = () => {
        const tbody = document.querySelector('#events tbody');
        if (!tbody) return;

        tbody.innerHTML = (state.events || []).map(event => `
            <tr class="hover:bg-slate-50">
                <td class="px-6 py-4">
                    <img src="${event.image_url || 'https://via.placeholder.com/50'}" alt="${event.name}" class="h-10 w-10 object-cover rounded-md inline-block mr-2">
                    <span class="font-semibold text-slate-900">${event.name}</span>
                </td>
                <td class="px-6 py-4 text-slate-600">${new Date(event.date).toLocaleDateString()}</td>
                <td class="px-6 py-4 text-slate-600 text-sm line-clamp-1">${event.description || event.location || ''}</td>
                <td class="px-6 py-4 text-center space-x-2">
                    <button class="text-blue-600 hover:underline font-semibold text-sm" onclick="AdminDashboard.editItem('events', ${event.id})">Edit</button>
                    <button class="text-red-500 hover:underline font-semibold text-sm" onclick="AdminDashboard.deleteItem('events', ${event.id})">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="px-6 py-4 text-center text-slate-500">No events found</td></tr>';
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const editId = form.dataset.editId;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const data = {
                name: form.querySelector('input[placeholder*="Summit"]').value, // Matches "e.g. Annual Youth Summit"
                date: form.querySelector('input[type="date"]').value,
                location: form.querySelector('input[placeholder="Event location"]').value,
                description: form.querySelector('textarea').value,
                image_url: form.querySelector('input[type="url"]')?.value || 'https://via.placeholder.com/300'
            };

            let result;
            if (editId) {
                result = await API.events.update(editId, data);
            } else {
                result = await API.events.create(data);
            }

            if (result.success) {
                Toast.success(editId ? 'Event updated successfully' : 'Event created successfully');
                closeModal('eventModal');
                form.reset();
                delete form.dataset.editId;
                await loadEvents();
                updateStats();
            } else {
                Toast.error(result.error || 'Failed to save event');
            }
        } catch (error) {
            console.error(error);
            Toast.error('An error occurred');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save';
        }
    };

    // --- Users ---
    const loadUsers = async () => {
        const result = await API.users.getAll();
        if (result.success) {
            state.users = result.data;
            renderUsersTable();
        }
    };

    const renderUsersTable = () => {
        const tbody = document.querySelector('#users tbody');
        if (!tbody) return;

        tbody.innerHTML = state.users.map(user => `
            <tr class="hover:bg-slate-50">
                <td class="px-6 py-4 font-semibold text-slate-900">${user.name}</td>
                <td class="px-6 py-4 text-slate-600">${user.email}</td>
                <td class="px-6 py-4">
                     <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">User</span>
                </td>
                 <td class="px-6 py-4">
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Active</span>
                </td>
                <td class="px-6 py-4 text-slate-600">-</td>
                <td class="px-6 py-4 text-center space-x-2">
                     <button class="text-blue-600 hover:underline font-semibold text-sm" onclick="AdminDashboard.editItem('users', ${user.id})">Edit</button>
                     <button class="text-red-500 hover:underline font-semibold text-sm" onclick="AdminDashboard.deleteItem('users', ${user.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    };


    // --- Shared ---
    const editItem = async (type, id) => {
        let item, modalId, form;

        // Find the item in state
        if (type === 'programs') {
            item = state.programs.find(p => p.id === id);
            modalId = 'programModal';
        } else if (type === 'services') {
            item = state.services.find(s => s.id === id);
            modalId = 'serviceModal';
        } else if (type === 'blog') {
            item = state.news.find(n => n.id === id);
            modalId = 'newsModal';
        } else if (type === 'events') {
            item = state.events.find(e => e.id === id);
            modalId = 'eventModal';
        } else if (type === 'users') {
            item = state.users.find(u => u.id === id);
            Toast.info('User editing not yet implemented');
            return;
        }

        if (!item) {
            Toast.error('Item not found');
            return;
        }

        // Open modal and pre-fill form
        openModal(modalId);
        form = document.querySelector(`#${modalId} form`);
        if (!form) return;

        // Set edit mode
        form.dataset.editId = id;

        // Pre-fill form fields based on type
        if (type === 'programs') {
            form.querySelector('input[placeholder*="Leadership"]').value = item.name || '';
            form.querySelector('textarea').value = item.description || '';
            const imgInput = form.querySelector('input[type="url"]');
            if (imgInput) imgInput.value = item.image_url || '';
        } else if (type === 'services') {
            form.querySelector('input[placeholder*="Coaching"]').value = item.name || '';
            form.querySelector('input[type="number"]').value = item.price || '';
            form.querySelector('textarea').value = item.description || '';
            const imgInput = form.querySelector('input[type="url"]');
            if (imgInput) imgInput.value = item.image_url || '';
        } else if (type === 'blog') {
            form.querySelector('input[placeholder="News title"]').value = item.title || '';
            form.querySelector('textarea').value = item.body || '';
            const imgInput = form.querySelector('input[type="url"]');
            if (imgInput) imgInput.value = item.image_url || '';
        } else if (type === 'events') {
            form.querySelector('input[placeholder*="Summit"]').value = item.name || '';
            form.querySelector('input[type="date"]').value = item.date || '';
            form.querySelector('input[placeholder="Event location"]').value = item.location || '';
            form.querySelector('textarea').value = item.description || '';
            const imgInput = form.querySelector('input[type="url"]');
            if (imgInput) imgInput.value = item.image_url || '';
        }

        // Update modal title to indicate editing
        const modalTitle = document.querySelector(`#${modalId} h2`);
        if (modalTitle) {
            modalTitle.textContent = `Edit ${type === 'blog' ? 'News' : type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}`;
        }
    };

    // --- Shared ---
    const deleteItem = async (type, id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        let result;
        if (type === 'programs') result = await API.programs.delete(id);
        else if (type === 'services') result = await API.services.delete(id);
        else if (type === 'blog') result = await API.blog.delete(id);
        else if (type === 'events') result = await API.events.delete(id);
        else if (type === 'users') result = await API.users.delete(id);

        if (result && result.success) {
            Toast.success('Item deleted');
            // Reload data
            if (type === 'programs') await loadPrograms();
            else if (type === 'services') await loadServices();
            else if (type === 'blog') await loadNews();
            else if (type === 'events') await loadEvents();
            else if (type === 'users') await loadUsers();
            updateStats();
        } else {
            Toast.error('Failed to delete item');
        }
    };

    const updateStats = () => {
        // Simple counters based on loaded data
        const stats = document.querySelectorAll('.text-4xl.font-bold');
        if (stats.length >= 4) {
            stats[0].textContent = state.users.length; // Members
            stats[1].textContent = state.programs.length; // Programs
            stats[2].textContent = state.services.length; // Services
            stats[3].textContent = state.news.length; // Posts
        }
    };

    const setupEventListeners = () => {
        // Forms
        document.querySelector('#programModal form')?.addEventListener('submit', handleProgramSubmit);
        document.querySelector('#serviceModal form')?.addEventListener('submit', handleServiceSubmit);
        document.querySelector('#newsModal form')?.addEventListener('submit', handleNewsSubmit);
        document.querySelector('#eventModal form')?.addEventListener('submit', handleEventSubmit);

        // Logout
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Auth.logout();
            });
        });
    };

    return {
        init,
        editItem,
        deleteItem
    };
})();

document.addEventListener('DOMContentLoaded', AdminDashboard.init);
