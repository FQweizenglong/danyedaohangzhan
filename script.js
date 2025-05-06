// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 显示页面加载动画
    showPageLoadingAnimation();
    
    // 获取搜索输入框和所有链接卡片
    const searchInput = document.getElementById('searchInput');
    const allLinkCards = document.querySelectorAll('.link-card');
    const sections = document.querySelectorAll('.nav-section');
    
    // 添加搜索事件监听（使用防抖动处理，提高性能）
    const debounceSearch = debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterContent(searchTerm, allLinkCards, sections);
    }, 300);
    
    searchInput.addEventListener('input', debounceSearch);
    
    // 添加搜索框的回车事件处理
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            // 如果只有一个可见卡片，则自动跳转
            const visibleCards = document.querySelectorAll('.link-card[style="display: block;"]');
            if (visibleCards.length === 1) {
                window.open(visibleCards[0].href, '_blank');
            }
        }
    });
    
    // 添加链接卡片动画效果
    animateLinkCards();
});

/**
 * 显示页面加载动画
 */
function showPageLoadingAnimation() {
    // 创建加载动画覆盖层
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);
    
    // 页面加载完成后淡出动画
    window.addEventListener('load', function() {
        loadingOverlay.classList.add('fade-out');
        setTimeout(function() {
            loadingOverlay.remove();
        }, 500);
    });
}

/**
 * 对搜索函数进行防抖处理
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖处理后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * 根据搜索词过滤内容
 * @param {string} searchTerm - 搜索词
 * @param {NodeList} allLinkCards - 所有链接卡片
 * @param {NodeList} sections - 所有部分
 */
function filterContent(searchTerm, allLinkCards, sections) {
    // 如果搜索词为空，显示所有内容
    if (searchTerm === '') {
        allLinkCards.forEach(card => {
            card.style.display = 'block';
        });
        
        sections.forEach(section => {
            section.style.display = 'block';
        });
        
        return;
    }
    
    // 隐藏所有卡片，稍后只显示匹配的卡片
    allLinkCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // 遍历所有链接卡片，检查是否匹配搜索词
    let foundInSection = new Set(); // 用于记录哪些部分有匹配项
    
    allLinkCards.forEach(card => {
        const title = card.querySelector('.link-title').textContent.toLowerCase();
        const url = card.getAttribute('href').toLowerCase();
        
        // 如果标题或URL包含搜索词，显示该卡片
        if (title.includes(searchTerm) || url.includes(searchTerm)) {
            card.style.display = 'block';
            
            // 找到该卡片所在的部分，并记录
            let section = card.closest('.nav-section');
            if (section) {
                foundInSection.add(section);
            }
        }
    });
    
    // 隐藏没有匹配项的部分，显示有匹配项的部分
    sections.forEach(section => {
        if (foundInSection.has(section)) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

/**
 * 添加链接卡片的动画效果
 */
function animateLinkCards() {
    const cards = document.querySelectorAll('.link-card');
    
    // 使用IntersectionObserver检测卡片是否进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 如果卡片进入视口，添加动画类
                entry.target.classList.add('card-animate');
                // 一旦添加了动画，不再观察该元素
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // 使用视口作为根元素
        threshold: 0.1 // 当10%的元素可见时触发
    });
    
    // 观察所有卡片
    cards.forEach(card => {
        observer.observe(card);
    });
} 