// Member Dashboard Module
const MemberDashboard = (() => {
    // State
    const state = {
        user: null,
        enrollments: [],
        events: []
    };

    // Initialize
    const init = async () => {
        // Check auth
        if (!Auth.requireAuth('member')) return;

        console.log('Member Dashboard initialized');
        state.user = Auth.getCurrentUser();

        updateUI();
        setupEventListeners();
    };

    const updateUI = () => {
        if (!state.user) return;

        const displayName = state.user.name || state.user.email.split('@')[0];

        // Update welcome message
        const welcomeMsg = document.querySelector('#overview-section h2');
        if (welcomeMsg) welcomeMsg.innerHTML = `👋 Welcome back, ${displayName}! <span class="text-sm font-normal text-slate-400 ml-2">· last login today</span>`;

        // Update top bar name
        const topBarName = document.querySelector('.bg-white\\/90 span.text-sm.text-slate-500');
        if (topBarName) topBarName.innerHTML = `<span class="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span> Welcome back, ${displayName}`;

        // Update profile inputs
        const emailInput = document.querySelector('#profile-section input[type="email"]');
        if (emailInput) emailInput.value = state.user.email;

        const sidebarEmail = document.querySelector('#user-email-sidebar');
        if (sidebarEmail) sidebarEmail.textContent = state.user.email;

        const footerEmail = document.querySelector('#user-email-footer');
        if (footerEmail) footerEmail.textContent = state.user.email;

        const nameInput = document.querySelector('#profile-section input[type="text"]');
        if (nameInput) nameInput.value = displayName;
    };

    const setupEventListeners = () => {
        // Logout
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                Auth.logout();
            });
        });
    };

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', MemberDashboard.init);
