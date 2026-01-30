
document.addEventListener('DOMContentLoaded', () => {
    const insightsContainer = document.querySelector('#insights .container');

    // Find or create grid container
    let grid = document.querySelector('.insights-grid');
    if (!grid && insightsContainer) {
        // Remove existing static content if we are initializing
        // Actually, we should target the specific container area.
        // Let's assume the HTML update checks out.
        // If not found, we might need to wait or it's not there yet.
        return;
    }

    renderInsights();
});

function renderInsights() {
    const grid = document.querySelector('.insights-grid');
    if (!grid) return;

    // 1. Get Posts
    const allPosts = JSON.parse(localStorage.getItem('insight_posts') || '[]');

    // 2. Separate Pinned vs Latest
    // Sort all by date desc first to ensure "latest" logic works naturally
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Candidates for Pinned (User Rule: "Collect all posts where pinned = true")
    const pinnedCandidates = allPosts.filter(p => p.pinned);

    // Candidates for Others (User Rule: "Collect all posts where pinned = false")
    const otherCandidates = allPosts.filter(p => !p.pinned);

    // 3. Selection Logic
    // "Take up to 2" from Pinned
    const selectedPinned = pinnedCandidates.slice(0, 2);

    // "Fill remaining slots with latest posts"
    // Total slots = 8
    const requiredTotal = 8;
    const slotsForOthers = requiredTotal - selectedPinned.length;

    const selectedOthers = otherCandidates.slice(0, slotsForOthers);

    // 4. Build Final List
    const displayList = [...selectedPinned, ...selectedOthers];

    // 5. Render
    grid.innerHTML = '';

    displayList.forEach(post => {
        const card = document.createElement('div');
        card.className = 'insight-card-new reveal'; // Add reveal class for animation

        const thumbnailSrc = post.thumbnail || 'https://via.placeholder.com/400x225/333/999?text=No+Image'; // Placeholder if empty
        const pinnedBadge = post.pinned ? '<span class="badge-pinned-public">고정</span>' : '';

        // Create Snippet
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content || '';
        const rawText = tempDiv.textContent || tempDiv.innerText || '';
        const snippet = rawText.length > 50 ? rawText.substring(0, 50) + '...' : rawText;

        card.innerHTML = `
            <div class="insight-thumb-box">
                <img src="${thumbnailSrc}" alt="${post.title}">
                ${pinnedBadge}
            </div>
            <div class="insight-info">
                <h3 class="insight-title">${post.title}</h3>
                <p class="insight-snippet">${snippet}</p>
                <div class="insight-date">${post.date}</div>
            </div>
        `;

        grid.appendChild(card);
    });

    // Re-trigger reveal animation if needed (optional, assuming main.js observer picks it up or we manually observe)
    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                }
            });
        });
        document.querySelectorAll('.insight-card-new').forEach(el => observer.observe(el));
    }
}
