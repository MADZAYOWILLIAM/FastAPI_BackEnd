// News Page Module
const NewsPage = (() => {
    // Initialize
    const init = () => {
        console.log('📰 News page initialized');
        loadNews();
    };

    // Load news from API
    const loadNews = async () => {
        try {
            const result = await API.blog.getAll();

            if (result.success) {
                renderNews(result.data);
            } else {
                console.error('Failed to load news:', result.error);
                renderError();
            }
        } catch (error) {
            console.error('Error loading news:', error);
            renderError();
        }
    };

    // Render news
    const renderNews = (newsItems) => {
        const container = document.querySelector('[data-news]');
        if (!container) return;

        if (newsItems.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-600">No news articles available at the moment.</p>
                </div>
            `;
            return;
        }

        const html = newsItems.map(item => `
            <article class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div class="bg-gradient-to-r from-blue-400 to-blue-600 h-48 flex items-center justify-center overflow-hidden">
                    ${item.image_url ?
                `<img src="${item.image_url}" alt="${item.title}" class="w-full h-full object-cover">` :
                `<span class="material-symbols-outlined text-white text-6xl">article</span>`
            }
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-xs font-bold text-[var(--primary-blue)] bg-blue-100 px-3 py-1 rounded-full">News</span>
                        <span class="text-xs text-slate-500">${new Date().toLocaleDateString()}</span> <!-- Placeholder date if not in schema -->
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">${item.title}</h3>
                    <p class="text-slate-600 mb-4 line-clamp-3">
                        ${item.body}
                    </p>
                    <a href="#" class="text-[var(--primary-blue)] font-bold hover:underline flex items-center gap-2">Read More <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
                </div>
            </article>
        `).join('');

        container.innerHTML = html;
    };

    const renderError = () => {
        const container = document.querySelector('[data-news]');
        if (!container) return;

        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-600">Failed to load news. Please try again later.</p>
            </div>
        `;
    };

    return {
        init
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    NewsPage.init();
    App.init();
});
