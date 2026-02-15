// Mobile sidebar toggle for all pages
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarPanel = document.getElementById('sidebarPanel');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');

    function openSidebar() {
        if (mobileSidebar && sidebarPanel) {
            mobileSidebar.classList.remove('hidden');
            setTimeout(function () {
                sidebarPanel.classList.remove('-translate-x-full');
            }, 10);
        }
    }

    function closeSidebarFunc() {
        if (sidebarPanel && mobileSidebar) {
            sidebarPanel.classList.add('-translate-x-full');
            setTimeout(function () {
                mobileSidebar.classList.add('hidden');
            }, 300);
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            openSidebar();
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarFunc);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebarFunc);
    }
});
