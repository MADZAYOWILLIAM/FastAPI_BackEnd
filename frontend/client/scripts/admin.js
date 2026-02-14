// Admin Dashboard Module
const AdminDashboard = (() => {
    // State
    const state = {
        programs: [],
        services: [],
        news: [],
        users: []
    };

    // Initialize
    const init = async () => {
        // Check auth
        if (!Auth.requireAuth()) return;

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
            loadUsers()
        ]);
        updateStats();
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
                <td class="px-6 py-4 font-semibold text-slate-900">${program.name}</td>
                <td class="px-6 py-4 text-slate-600">${program.date || 'N/A'}</td> <!-- using date as duration placeholder -->
                <td class="px-6 py-4 text-slate-600">0</td> <!-- Enrolled placeholder -->
                <td class="px-6 py-4">
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Active</span>
                </td>
                <td class="px-6 py-4 text-center">
                    <button class="text-red-500 hover:underline font-semibold text-sm" onclick="AdminDashboard.deleteItem('programs', ${program.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    };

    const handleProgramSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const data = {
                name: form.querySelector('input[placeholder*="Program Name"]').value,
                description: form.querySelector('textarea').value,
                // Using input fields as placeholders for start/end date since schema requires them
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], // +30 days
                image_url: 'https://via.placeholder.com/300' // Placeholder for now
            };

            // Map the "Duration" input to start/end date logic if needed, or just store it in description?
            // For now sticking to schema requirements.

            const result = await API.programs.create(data);
            if (result.success) {
                Toast.success('Program created successfully');
                closeModal('programModal');
                form.reset();
                loadPrograms();
            } else {
                Toast.error(result.error || 'Failed to create program');
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
                <td class="px-6 py-4 font-semibold text-slate-900">${service.name}</td>
                <td class="px-6 py-4 text-slate-600">$${service.price}</td>
                <td class="px-6 py-4 text-slate-600">-</td>
                <td class="px-6 py-4">
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Active</span>
                </td>
                <td class="px-6 py-4 text-center">
                    <button class="text-red-500 hover:underline font-semibold text-sm" onclick="AdminDashboard.deleteItem('services', ${service.id || 0})">Delete</button>
                    <!-- Note: service.id might be missing in response if not standardized, check schema -->
                </td>
            </tr>
        `).join('');
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const data = {
                name: form.querySelector('input[placeholder*="Service Name"]').value,
                description: form.querySelector('textarea').value,
                price: parseFloat(form.querySelector('input[type="number"]').value),
                image_url: 'https://via.placeholder.com/300'
            };

            const result = await API.services.create(data);
            if (result.success) {
                Toast.success('Service created successfully');
                closeModal('serviceModal');
                form.reset();
                loadServices();
            } else {
                Toast.error(result.error || 'Failed to create service');
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
                <td class="px-6 py-4 font-semibold text-slate-900">${item.title}</td>
                <td class="px-6 py-4 text-slate-600">General</td>
                <td class="px-6 py-4 text-slate-600">-</td>
                <td class="px-6 py-4 text-slate-600">-</td>
                <td class="px-6 py-4 text-center">
                    <button class="text-red-500 hover:underline font-semibold text-sm" onclick="AdminDashboard.deleteItem('blog', ${item.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    };

    const handleNewsSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const data = {
                title: form.querySelector('input[placeholder="News title"]').value,
                body: form.querySelector('textarea').value,
                image_url: 'https://via.placeholder.com/300'
            };

            const result = await API.blog.create(data);
            if (result.success) {
                Toast.success('News created successfully');
                closeModal('newsModal');
                form.reset();
                loadNews();
            } else {
                Toast.error(result.error || 'Failed to create news');
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
                <td class="px-6 py-4 text-center">
                     <button class="text-red-500 hover:underline font-semibold text-sm" onclick="AdminDashboard.deleteItem('users', ${user.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    };


    // --- Shared ---
    const deleteItem = async (type, id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        let result;
        if (type === 'programs') result = await API.programs.delete(id);
        else if (type === 'services') result = await API.services.delete(id);
        else if (type === 'blog') result = await API.blog.delete(id);
        else if (type === 'users') result = await API.users.delete(id);

        if (result && result.success) {
            Toast.success('Item deleted');
            // Reload data
            if (type === 'programs') loadPrograms();
            else if (type === 'services') loadServices();
            else if (type === 'blog') loadNews();
            else if (type === 'users') loadUsers();
        } else {
            Toast.error('Failed to delete item');
        }
    };

    const updateStats = () => {
        // Simple counters based on loaded data
        // Note: These selectors depend on the exact HTML structure
        const stats = document.querySelectorAll('.text-3xl.font-bold.text-slate-900.mt-2');
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

        // Logout
        document.querySelector('button.bg-slate-100')?.addEventListener('click', () => {
            Auth.logout();
        });
    };

    return {
        init,
        deleteItem
    };
})();

document.addEventListener('DOMContentLoaded', AdminDashboard.init);
