// ===============================
// APP STATE VA GLOBAL O'ZGARUVCHILAR
// ===============================
const appState = {
    isLoggedIn: false,
    currentUser: null,
    selectedPost: null,
    selectedCriteria: 'likes',
    winnersCount: 3,
    participants: [],
    winners: [],
    filteredParticipants: [],
    currentStep: 'login',
    demoMode: false
};

// ===============================
// DOM ELEMENTLARINI TOPISH
// ===============================
const elements = {
    // Yuklanish ekrani
    loadingScreen: document.getElementById('loadingScreen'),
    
    // Navigatsiya
    navMenu: document.getElementById('navMenu'),
    menuToggle: document.getElementById('menuToggle'),
    
    // Asosiy tugmalar
    startGiveawayBtn: document.getElementById('startGiveawayBtn'),
    demoBtn: document.getElementById('demoBtn'),
    loginBtn: document.getElementById('loginBtn'),
    ctaBtn: document.getElementById('ctaBtn'),
    
    // Modal elementlari
    loginModal: document.getElementById('loginModal'),
    closeLoginModal: document.getElementById('closeLoginModal'),
    realLoginBtn: document.getElementById('realLoginBtn'),
    quickDemoBtn: document.getElementById('quickDemoBtn'),
    
    // Asosiy app konteyneri
    appContainer: document.getElementById('appContainer'),
    
    // Footer tugmalari
    contactBtn: document.getElementById('contactBtn'),
    faqBtn: document.getElementById('faqBtn'),
    privacyBtn: document.getElementById('privacyBtn')
};

// ===============================
// YORDAMCHI FUNKSIYALAR
// ===============================

// Xabarlarni ko'rsatish
function showNotification(message, type = 'info') {
    // Eski xabarlarni olib tashlash
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Yangi xabar yaratish
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon tanlash
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Stil berish
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '2000',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
    });
    
    // Rang berish
    if (type === 'success') notification.style.background = '#10B981';
    else if (type === 'error') notification.style.background = '#EF4444';
    else if (type === 'warning') notification.style.background = '#F59E0B';
    else notification.style.background = '#405DE6';
    
    document.body.appendChild(notification);
    
    // 5 soniyadan keyin olib tashlash
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Animatsiya uchun CSS qo'shish
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Yuklanishni ko'rsatish
function showLoading(message = 'Yuklanmoqda...') {
    // Yuklanish ekranini yaratish yoki topish
    let loading = document.getElementById('customLoading');
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'customLoading';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        // Stil berish
        Object.assign(loading.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999',
            backdropFilter: 'blur(5px)'
        });
        
        const style = document.createElement('style');
        style.textContent = `
            .loading-content {
                text-align: center;
            }
            .loading-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #E4405F;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            .loading-text {
                color: #666;
                font-size: 16px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loading);
    } else {
        loading.style.display = 'flex';
        const text = loading.querySelector('.loading-text');
        if (text) text.textContent = message;
    }
}

// Yuklanishni yashirish
function hideLoading() {
    const loading = document.getElementById('customLoading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Statistikani yangilash
function updateStats() {
    // Demo uchun random raqamlar
    const stats = {
        usersCount: Math.floor(Math.random() * 5000) + 1000,
        giveawaysCount: Math.floor(Math.random() * 10000) + 5000,
        winnersCount: Math.floor(Math.random() * 20000) + 10000
    };
    
    // Elementlarni yangilash
    const usersCountEl = document.getElementById('usersCount');
    const giveawaysCountEl = document.getElementById('giveawaysCount');
    const winnersCountEl = document.getElementById('winnersCount');
    
    if (usersCountEl) usersCountEl.textContent = `${stats.usersCount.toLocaleString()}+`;
    if (giveawaysCountEl) giveawaysCountEl.textContent = `${stats.giveawaysCount.toLocaleString()}+`;
    if (winnersCountEl) winnersCountEl.textContent = `${stats.winnersCount.toLocaleString()}+`;
}

// Demo ishtirokchilar yaratish
function generateDemoParticipants(count) {
    const usernames = [
        'ali_developer', 'sara_designer', 'john_smith', 'emma_watson', 'mike_jones',
        'lisa_ray', 'tom_cruise', 'anna_karenina', 'bob_marley', 'david_beckham',
        'uzbek_traveler', 'tashkent_city', 'samarkand_beauty', 'bukhara_old', 'khiva_history',
        'navoiy_poet', 'amir_temur', 'alisher_navoi', 'beruniy_scientist', 'farabi_philosopher',
        'java_programmer', 'python_master', 'web_designer', 'mobile_dev', 'data_scientist',
        'digital_marketer', 'content_creator', 'photography_lover', 'travel_blogger', 'food_expert'
    ];
    
    const comments = [
        'Men qatnashyapman! 😍', 'Omad tilayman hammaga!', 'InstaGiveaway zo\'r ishlaydi!',
        'iPhone kerak edi!', 'G\'olib men bo\'laman inshaAllah', 'Birorta shart bormi?',
        'Qachongacha davom etadi?', 'O\'zimga kerak edi', 'Omadimni sinab ko\'ray',
        'Hammaga omad!', 'Birinchi sharh', 'So\'nggi sharh', 'Qanday qilib qatnashsam bo\'ladi?',
        'Kim g\'olib bo\'lsa, omadli!', 'Kutib turaman!', 'Bunday imkoniyat juda zo\'r',
        'Har doim shu saytdan foydalanaman', 'Test kommentariya', 'Yana bitta imkoniyat',
        'Umid qilamanki, men g\'olib bo\'laman', 'Hammaga omad tilayman!', 'Bu haqiqatan ham ishlaydimi?',
        'Keling, sinab ko\'ramiz!', 'Judayam qiziqarli', 'Menga shu kerak edi!'
    ];
    
    const participants = [];
    
    for (let i = 0; i < count; i++) {
        const username = usernames[Math.floor(Math.random() * usernames.length)] || `user_${i + 1}`;
        const comment = Math.random() > 0.3 ? comments[Math.floor(Math.random() * comments.length)] : null;
        const liked = Math.random() > 0.5;
        const follows = Math.random() > 0.7;
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        
        participants.push({
            id: i + 1,
            username: username,
            fullName: `${username} foydalanuvchi`,
            comment: comment,
            liked: liked,
            follows: follows,
            timestamp: `${hoursAgo} soat ${minutesAgo} daqiqa oldin`,
            isFollower: Math.random() > 0.6,
            profilePic: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
        });
    }
    
    return participants;
}

// Demo postlar yaratish
function generateDemoPosts() {
    return [
        {
            id: 'post_1',
            caption: 'iPhone 14 PRO MAX tanlovi! 🎁',
            likes: 2350,
            comments: 189,
            date: '2 kun oldin',
            isGiveaway: true,
            image: 'https://images.unsplash.com/photo-1632526448515-5a8d03e6c42b?w=400&h=400&fit=crop'
        },
        {
            id: 'post_2',
            caption: 'Yangi kolleksiyamiz chiqdi',
            likes: 850,
            comments: 45,
            date: '5 kun oldin',
            isGiveaway: false,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
        },
        {
            id: 'post_3',
            caption: 'MacBook Pro tanlovi boshladi',
            likes: 3200,
            comments: 215,
            date: '1 hafta oldin',
            isGiveaway: true,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w-400&h=400&fit=crop'
        },
        {
            id: 'post_4',
            caption: 'Samarqand sayohat fotolari',
            likes: 560,
            comments: 32,
            date: '2 hafta oldin',
            isGiveaway: false,
            image: 'https://images.unsplash.com/photo-1599733875147-259389120c85?w=400&h=400&fit=crop'
        },
        {
            id: 'post_5',
            caption: 'AirPods Pro 3 kishi uchun',
            likes: 1800,
            comments: 120,
            date: '3 hafta oldin',
            isGiveaway: true,
            image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop'
        },
        {
            id: 'post_6',
            caption: 'Kundalik hayotimdan lavhalar',
            likes: 950,
            comments: 67,
            date: '1 oy oldin',
            isGiveaway: false,
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop'
        }
    ];
}

// ===============================
// ASOSIY FUNKSIYALAR
// ===============================

// Ilovani ishga tushirish
function initApp() {
    console.log('InstaGiveaway ilovasi ishga tushmoqda...');
    
    // Yuklanish ekranini 1.5 soniyadan keyin yashirish
    setTimeout(() => {
        if (elements.loadingScreen) {
            elements.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                elements.loadingScreen.style.display = 'none';
            }, 300);
        }
    }, 1500);
    
    // Statistikani yangilash
    updateStats();
    
    // Har 30 soniyada statistikani yangilash
    setInterval(updateStats, 30000);
    
    // Event listenerlarni o'rnatish
    setupEventListeners();
    
    // Saqlangan login ma'lumotlarini tekshirish
    checkSavedLogin();
    
    console.log('Ilova muvaffaqiyatli ishga tushdi!');
}

// Barcha event listenerlarni o'rnatish
function setupEventListeners() {
    console.log('Event listenerlar o\'rnatilmoqda...');
    
    // Mobil menyu
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigatsiya linklari
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            scrollToSection(target);
            
            // Faqat mobil versiyada
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });
    
    // Tanlovni boshlash tugmasi
    if (elements.startGiveawayBtn) {
        elements.startGiveawayBtn.addEventListener('click', showLoginModal);
    }
    
    // Demo tugmasi
    if (elements.demoBtn) {
        elements.demoBtn.addEventListener('click', startDemoMode);
    }
    
    // Login tugmasi (navbar)
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', showLoginModal);
    }
    
    // Asosiy CTA tugmasi
    if (elements.ctaBtn) {
        elements.ctaBtn.addEventListener('click', showLoginModal);
    }
    
    // Modal yopish tugmasi
    if (elements.closeLoginModal) {
        elements.closeLoginModal.addEventListener('click', hideLoginModal);
    }
    
    // Haqiqiy Instagram login
    if (elements.realLoginBtn) {
        elements.realLoginBtn.addEventListener('click', simulateInstagramLogin);
    }
    
    // Tezkor demo
    if (elements.quickDemoBtn) {
        elements.quickDemoBtn.addEventListener('click', quickDemoLogin);
    }
    
    // Modal tashqarisiga bosganda yopish
    if (elements.loginModal) {
        elements.loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideLoginModal();
            }
        });
    }
    
    // Footer tugmalari
    if (elements.contactBtn) {
        elements.contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Aloqa ma\'lumotlari tez orada qo\'shiladi!', 'info');
        });
    }
    
    if (elements.faqBtn) {
        elements.faqBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Savol-javoblar bo\'limi tez orada qo\'shiladi!', 'info');
        });
    }
    
    if (elements.privacyBtn) {
        elements.privacyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Maxfiylik siyosati tez orada qo\'shiladi!', 'info');
        });
    }
    
    // Escape tugmasi bilan modalni yopish
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideLoginModal();
        }
    });
    
    console.log('Event listenerlar muvaffaqiyatli o\'rnatildi!');
}

// Mobil menyuni ochish/yopish
function toggleMobileMenu() {
    if (elements.navMenu) {
        elements.navMenu.classList.toggle('active');
        const icon = elements.menuToggle.querySelector('i');
        if (icon) {
            if (elements.navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
}

// Sectionga scroll qilish
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// Login modalini ko'rsatish
function showLoginModal() {
    if (elements.loginModal) {
        elements.loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Login modalini yashirish
function hideLoginModal() {
    if (elements.loginModal) {
        elements.loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Instagram login simulyatsiyasi
function simulateInstagramLogin() {
    showLoading('Instagram akkauntingizga kirilmoqda...');
    
    setTimeout(() => {
        const user = {
            id: 'instagram_user_' + Date.now(),
            username: 'uzbek_blogger',
            fullName: 'Uzbekistan Travel Blogger',
            profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
            posts: 156,
            followers: 25400,
            following: 1250,
            isVerified: true,
            bio: 'Travel enthusiast | Photographer | Blogger',
            website: 'https://uzbek-travel.uz'
        };
        
        appState.isLoggedIn = true;
        appState.currentUser = user;
        appState.demoMode = false;
        
        // LocalStorage ga saqlash
        localStorage.setItem('instaGiveaway_user', JSON.stringify(user));
        localStorage.setItem('instaGiveaway_lastLogin', Date.now().toString());
        
        hideLoading();
        hideLoginModal();
        showNotification('Instagram akkauntingizga muvaffaqiyatli kirdingiz!', 'success');
        
        loadMainApp();
        
    }, 2000);
}

// Tezkor demo login
function quickDemoLogin() {
    showLoading('Demo rejimga kirilmoqda...');
    
    setTimeout(() => {
        const user = {
            id: 'demo_user_' + Date.now(),
            username: 'demo_instagram',
            fullName: 'Demo Instagram User',
            profilePic: '',
            posts: 45,
            followers: 8500,
            following: 450,
            isVerified: false,
            bio: 'Demo account for testing',
            website: ''
        };
        
        appState.isLoggedIn = true;
        appState.currentUser = user;
        appState.demoMode = true;
        
        hideLoading();
        hideLoginModal();
        showNotification('Demo rejimga muvaffaqiyatli kirdingiz!', 'info');
        
        loadMainApp();
        
    }, 1000);
}

// Demo rejimni boshlash
function startDemoMode() {
    showLoading('Demo ma\'lumotlari yuklanmoqda...');
    
    setTimeout(() => {
        const user = {
            id: 'demo_mode_user',
            username: 'tanlov_demo',
            fullName: 'Tanlov Demo Foydalanuvchi',
            profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
            posts: 28,
            followers: 12500,
            following: 680,
            isVerified: true,
            bio: 'Giveaway organizer | Content creator',
            website: 'https://example.com'
        };
        
        appState.isLoggedIn = true;
        appState.currentUser = user;
        appState.demoMode = true;
        
        hideLoading();
        showNotification('Demo rejim yuklandi!', 'success');
        
        loadMainApp();
        
    }, 1500);
}

// Saqlangan login ma'lumotlarini tekshirish
function checkSavedLogin() {
    const savedUser = localStorage.getItem('instaGiveaway_user');
    const lastLogin = localStorage.getItem('instaGiveaway_lastLogin');
    
    if (savedUser && lastLogin) {
        try {
            const user = JSON.parse(savedUser);
            const timeSinceLogin = Date.now() - parseInt(lastLogin);
            const oneDay = 24 * 60 * 60 * 1000;
            
            // Agar 1 kundan kam vaqt o'tgan bo'lsa, avtologin
            if (timeSinceLogin < oneDay) {
                appState.isLoggedIn = true;
                appState.currentUser = user;
                appState.demoMode = false;
                
                console.log('Avtomatik login amalga oshirildi');
            }
        } catch (e) {
            console.error('Login ma\'lumotlarini o\'qishda xatolik:', e);
            localStorage.removeItem('instaGiveaway_user');
            localStorage.removeItem('instaGiveaway_lastLogin');
        }
    }
}

// Asosiy app interfeysini yuklash
function loadMainApp() {
    console.log('Asosiy app yuklanmoqda...');
    
    // Asosiy sahifa kontentini yashirish
    const mainContent = document.querySelector('main');
    const footer = document.querySelector('footer');
    
    if (mainContent) mainContent.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // App konteynerini ko'rsatish
    if (elements.appContainer) {
        elements.appContainer.style.display = 'block';
        elements.appContainer.innerHTML = `
            <div class="app-header">
                <div class="container">
                    <div class="app-nav">
                        <button class="app-back-btn" id="appBackBtn">
                            <i class="fas fa-arrow-left"></i> Orqaga
                        </button>
                        <div class="app-user">
                            <div class="user-avatar">
                                ${appState.currentUser.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div class="username">@${appState.currentUser.username}</div>
                                ${appState.demoMode ? '<div class="demo-badge">DEMO</div>' : ''}
                            </div>
                        </div>
                        <button class="app-logout-btn" id="appLogoutBtn">
                            <i class="fas fa-sign-out-alt"></i> Chiqish
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="app-content" id="appContent">
                <!-- Content will be loaded here -->
            </div>
        `;
        
        // App uchun style qo'shish
        addAppStyles();
        
        // App event listenerlarini o'rnatish
        setupAppEventListeners();
        
        // Dastlabki qadamni yuklash
        loadAppStep('selectPost');
    }
}

// App uchun style qo'shish
function addAppStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .app-header {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }
        
        .app-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .app-back-btn {
            background: none;
            border: none;
            color: #E4405F;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.3s;
        }
        
        .app-back-btn:hover {
            background: #f8f9fa;
        }
        
        .app-user {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
        
        .username {
            font-weight: 600;
            color: #121212;
            font-size: 16px;
        }
        
        .demo-badge {
            background: #F59E0B;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 4px;
        }
        
        .app-logout-btn {
            background: #EF4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .app-logout-btn:hover {
            background: #DC2626;
        }
        
        .app-content {
            padding: 100px 0 40px;
            min-height: calc(100vh - 80px);
            background: #FAFAFA;
        }
        
        .step-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .step-title {
            font-size: 32px;
            margin-bottom: 10px;
            color: #121212;
            text-align: center;
        }
        
        .step-subtitle {
            color: #8E8E8E;
            margin-bottom: 30px;
            font-size: 18px;
            text-align: center;
        }
        
        .user-profile {
            background: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .profile-avatar {
            width: 80px;
            height: 80px;
            background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            font-weight: bold;
        }
        
        .profile-info h2 {
            margin-bottom: 10px;
            color: #121212;
            font-size: 24px;
        }
        
        .profile-stats {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .profile-stats span {
            color: #8E8E8E;
            font-size: 14px;
        }
        
        .profile-stats strong {
            color: #121212;
            font-size: 16px;
        }
        
        .posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .post-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s;
            border: 2px solid transparent;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .post-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .post-card.selected {
            border-color: #E4405F;
        }
        
        .post-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(45deg, #833AB4, #E1306C);
            position: relative;
            overflow: hidden;
        }
        
        .post-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .post-meta {
            padding: 15px;
        }
        
        .post-meta p {
            font-weight: 500;
            margin-bottom: 10px;
            color: #121212;
            font-size: 15px;
            line-height: 1.4;
        }
        
        .post-stats {
            display: flex;
            gap: 15px;
            font-size: 14px;
            color: #8E8E8E;
        }
        
        .post-stat {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .criteria-selection {
            background: #f8f9ff;
            padding: 25px;
            border-radius: 15px;
            margin: 30px 0;
            border: 1px solid #e6e9ff;
        }
        
        .criteria-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .criteria-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
            border: 2px solid transparent;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        .criteria-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        .criteria-card.selected {
            border-color: #E4405F;
            background: #fff5f7;
        }
        
        .criteria-card i {
            font-size: 32px;
            margin-bottom: 10px;
            display: block;
        }
        
        .criteria-card h4 {
            margin-bottom: 8px;
            color: #121212;
        }
        
        .criteria-card p {
            color: #8E8E8E;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .participants-list {
            max-height: 500px;
            overflow-y: auto;
            margin: 30px 0;
            padding: 10px;
        }
        
        .participant-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid #DBDBDB;
            transition: all 0.3s;
        }
        
        .participant-item:hover {
            transform: translateX(5px);
            border-color: #E4405F;
        }
        
        .participant-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .participant-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .participant-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .winner-badge {
            background: gold;
            color: #856404;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: none;
            align-items: center;
            gap: 5px;
        }
        
        .step-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 40px;
            flex-wrap: wrap;
        }
        
        .btn-primary {
            background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(228, 64, 95, 0.4);
        }
        
        .btn-secondary {
            background: white;
            color: #E4405F;
            border: 2px solid #E4405F;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-secondary:hover {
            background: #E4405F;
            color: white;
        }
        
        @media (max-width: 768px) {
            .step-title {
                font-size: 24px;
            }
            
            .step-subtitle {
                font-size: 16px;
            }
            
            .posts-grid {
                grid-template-columns: 1fr;
            }
            
            .criteria-grid {
                grid-template-columns: 1fr;
            }
            
            .step-actions {
                flex-direction: column;
            }
            
            .step-actions button {
                width: 100%;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
}

// App event listenerlarini o'rnatish
function setupAppEventListeners() {
    // Orqaga tugmasi
    document.getElementById('appBackBtn')?.addEventListener('click', goBack);
    
    // Chiqish tugmasi
    document.getElementById('appLogoutBtn')?.addEventListener('click', logout);
}

// Orqaga qaytish
function goBack() {
    switch(appState.currentStep) {
        case 'selectCriteria':
            loadAppStep('selectPost');
            break;
        case 'pickWinners':
            loadAppStep('selectCriteria');
            break;
        case 'results':
            loadAppStep('pickWinners');
            break;
        default:
            // Asosiy sahifaga qaytish
            location.reload();
    }
}

// Akkauntdan chiqish
function logout() {
    if (confirm('Haqiqatan ham akkauntingizdan chiqmoqchimisiz?')) {
        appState.isLoggedIn = false;
        appState.currentUser = null;
        appState.demoMode = false;
        
        localStorage.removeItem('instaGiveaway_user');
        localStorage.removeItem('instaGiveaway_lastLogin');
        
        showNotification('Akkauntingizdan muvaffaqiyatli chiqdingiz', 'info');
        location.reload();
    }
}

// App qadamini yuklash
function loadAppStep(step) {
    appState.currentStep = step;
    const appContent = document.getElementById('appContent');
    
    if (!appContent) return;
    
    switch(step) {
        case 'selectPost':
            loadSelectPostStep(appContent);
            break;
        case 'selectCriteria':
            loadSelectCriteriaStep(appContent);
            break;
        case 'pickWinners':
            loadPickWinnersStep(appContent);
            break;
        case 'results':
            loadResultsStep(appContent);
            break;
    }
}

// Post tanlash qadamini yuklash
function loadSelectPostStep(container) {
    container.innerHTML = `
        <div class="step-container">
            <h1 class="step-title">Tanlov uchun Post Tanlang</h1>
            <p class="step-subtitle">Instagram profilingizdagi postingizni tanlang</p>
            
            <div class="user-profile">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${appState.currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div class="profile-info">
                        <h2>@${appState.currentUser.username}</h2>
                        <div class="profile-stats">
                            <span><strong>${appState.currentUser.posts}</strong> postlar</span>
                            <span><strong>${appState.currentUser.followers?.toLocaleString()}</strong> obunachilar</span>
                            <span><strong>${appState.currentUser.following?.toLocaleString()}</strong> obunalar</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="posts-grid" id="postsGrid">
                <!-- Postlar shu yerga yuklanadi -->
            </div>
            
            <div class="step-actions">
                <button class="btn-primary" id="nextStepBtn" disabled>
                    Keyingi Qadam <i class="fas fa-arrow-right"></i>
                </button>
                <button class="btn-secondary" id="refreshPostsBtn">
                    <i class="fas fa-sync-alt"></i> Postlarni Yangilash
                </button>
            </div>
        </div>
    `;
    
    // Demo postlarni yuklash
    loadDemoPosts();
    
    // Tugmalarga event listener qo'shish
    setTimeout(() => {
        const nextStepBtn = document.getElementById('nextStepBtn');
        const refreshPostsBtn = document.getElementById('refreshPostsBtn');
        
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => {
                if (appState.selectedPost) {
                    loadAppStep('selectCriteria');
                }
            });
        }
        
        if (refreshPostsBtn) {
            refreshPostsBtn.addEventListener('click', () => {
                showLoading('Postlar yangilanmoqda...');
                setTimeout(() => {
                    loadDemoPosts();
                    hideLoading();
                    showNotification('Postlar yangilandi!', 'success');
                }, 1000);
            });
        }
    }, 100);
}

// Demo postlarni yuklash
function loadDemoPosts() {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    const demoPosts = generateDemoPosts();
    postsGrid.innerHTML = '';
    
    demoPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.dataset.id = post.id;
        
        postCard.innerHTML = `
            <div class="post-image">
                ${post.isGiveaway ? 
                    '<div style="position: absolute; top: 10px; right: 10px; background: gold; color: #856404; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; display: flex; align-items: center; gap: 5px;"><i class="fas fa-gift"></i> TANLOV</div>' 
                    : ''}
                <img src="${post.image}" alt="${post.caption}">
            </div>
            <div class="post-meta">
                <p>${post.caption}</p>
                <div class="post-stats">
                    <div class="post-stat">
                        <i class="fas fa-heart" style="color: #E4405F;"></i> ${post.likes.toLocaleString()}
                    </div>
                    <div class="post-stat">
                        <i class="fas fa-comment" style="color: #405DE6;"></i> ${post.comments.toLocaleString()}
                    </div>
                    <div class="post-stat">
                        <i class="far fa-clock" style="color: #8E8E8E;"></i> ${post.date}
                    </div>
                </div>
            </div>
        `;
        
        postCard.addEventListener('click', () => {
            // Barcha postlardan tanlangan klassini olib tashlash
            document.querySelectorAll('.post-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Tanlangan postga klass qo'shish
            postCard.classList.add('selected');
            
            // State ga saqlash
            appState.selectedPost = post;
            
            // Keyingi tugmani yoqish
            const nextStepBtn = document.getElementById('nextStepBtn');
            if (nextStepBtn) {
                nextStepBtn.disabled = false;
            }
            
            // Xabar ko'rsatish
            const shortCaption = post.caption.length > 30 ? post.caption.substring(0, 30) + '...' : post.caption;
            showNotification(`"${shortCaption}" tanlandi`, 'success');
        });
        
        postsGrid.appendChild(postCard);
    });
}

// Mezon tanlash qadamini yuklash
function loadSelectCriteriaStep(container) {
    if (!appState.selectedPost) {
        loadAppStep('selectPost');
        return;
    }
    
    container.innerHTML = `
        <div class="step-container">
            <h1 class="step-title">Tanlov Mezonlarini Tanlang</h1>
            <p class="step-subtitle">Qaysi ishtirokchilarni tanlashni istaysiz?</p>
            
            <div class="selected-post-info">
                <h3 style="margin-bottom: 10px;">Tanlangan Post:</h3>
                <p style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    ${appState.selectedPost.caption}
                </p>
                <div style="display: flex; gap: 20px; color: #666;">
                    <span><i class="fas fa-heart" style="color: #E4405F;"></i> ${appState.selectedPost.likes.toLocaleString()} layklar</span>
                    <span><i class="fas fa-comment" style="color: #405DE6;"></i> ${appState.selectedPost.comments.toLocaleString()} kommentlar</span>
                </div>
            </div>
            
            <div class="criteria-selection">
                <h3 style="margin-bottom: 20px;">Tanlash Mezonlari:</h3>
                <div class="criteria-grid" id="criteriaGrid">
                    <div class="criteria-card" data-criteria="comments">
                        <i class="fas fa-comment" style="color: #405DE6;"></i>
                        <h4>Faqat Kommentlar</h4>
                        <p>Postga komment qoldirganlar</p>
                    </div>
                    <div class="criteria-card" data-criteria="likes">
                        <i class="fas fa-heart" style="color: #E4405F;"></i>
                        <h4>Faqat Layklar</h4>
                        <p>Postni layk bosganlar</p>
                    </div>
                    <div class="criteria-card" data-criteria="both">
                        <i class="fas fa-users" style="color: #10B981;"></i>
                        <h4>Ikkalasi Ham</h4>
                        <p>Komment va layk bosganlar</p>
                    </div>
                    <div class="criteria-card" data-criteria="followers">
                        <i class="fas fa-user-plus" style="color: #F59E0B;"></i>
                        <h4>Obunachilar</h4>
                        <p>Sizga obuna bo'lganlar</p>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <label style="font-weight: 600; display: block; margin-bottom: 10px;">G'oliblar soni:</label>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <input type="number" id="winnersCount" value="${appState.winnersCount}" min="1" max="50" 
                               style="padding: 10px; border: 2px solid #DBDBDB; border-radius: 8px; width: 80px; font-size: 16px;">
                        <span style="color: #8E8E8E;">kishi</span>
                    </div>
                </div>
            </div>
            
            <div class="step-actions">
                <button class="btn-primary" id="analyzeParticipantsBtn">
                    <i class="fas fa-search"></i> Ishtirokchilarni Tahlil Qilish
                </button>
                <button class="btn-secondary" id="backToPostsBtn">
                    <i class="fas fa-arrow-left"></i> Postni O'zgartirish
                </button>
            </div>
        </div>
    `;
    
    // Default tanlangan mezoni belgilash
    setTimeout(() => {
        const defaultCriteria = document.querySelector(`[data-criteria="${appState.selectedCriteria}"]`);
        if (defaultCriteria) {
            defaultCriteria.classList.add('selected');
        }
        
        // Barcha mezon kartalariga event listener qo'shish
        document.querySelectorAll('.criteria-card').forEach(card => {
            card.addEventListener('click', function() {
                // Barcha kartalardan tanlangan klassini olib tashlash
                document.querySelectorAll('.criteria-card').forEach(c => {
                    c.classList.remove('selected');
                });
                
                // Tanlangan kartaga klass qo'shish
                this.classList.add('selected');
                appState.selectedCriteria = this.dataset.criteria;
            });
        });
        
        // Tahlil qilish tugmasi
        const analyzeBtn = document.getElementById('analyzeParticipantsBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                const winnersCount = parseInt(document.getElementById('winnersCount').value) || 3;
                
                if (winnersCount < 1 || winnersCount > 50) {
                    showNotification('G\'oliblar soni 1 dan 50 gacha bo\'lishi kerak!', 'error');
                    return;
                }
                
                appState.winnersCount = winnersCount;
                appState.participants = generateDemoParticipants(100);
                loadAppStep('pickWinners');
            });
        }
        
        // Orqaga qaytish tugmasi
        const backBtn = document.getElementById('backToPostsBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                loadAppStep('selectPost');
            });
        }
    }, 100);
}

// G'oliblarni tanlash qadamini yuklash
function loadPickWinnersStep(container) {
    if (!appState.participants.length) {
        loadAppStep('selectCriteria');
        return;
    }
    
    container.innerHTML = `
        <div class="step-container">
            <h1 class="step-title">G'oliblarni Tanlang</h1>
            <p class="step-subtitle" id="participantsCount">${appState.participants.length} ta ishtirokchi topildi</p>
            
            <div class="criteria-info">
                <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <p><strong>Tanlov mezonlari:</strong> 
                    ${appState.selectedCriteria === 'comments' ? 'Faqat komment qoldirganlar' :
                      appState.selectedCriteria === 'likes' ? 'Faqat layk bosganlar' :
                      appState.selectedCriteria === 'both' ? 'Komment va layk bosganlar' : 'Obunachilar'}
                    </p>
                    <p><strong>G'oliblar soni:</strong> ${appState.winnersCount} kishi</p>
                </div>
            </div>
            
            <div class="participants-list" id="participantsList">
                <!-- Ishtirokchilar shu yerga yuklanadi -->
            </div>
            
            <div class="step-actions">
                <button class="btn-primary" id="pickWinnersBtn">
                    <i class="fas fa-trophy"></i> G'oliblarni Tasodifiy Tanlash
                </button>
                <button class="btn-secondary" id="changeCriteriaBtn">
                    <i class="fas fa-cog"></i> Mezonlarni O'zgartirish
                </button>
            </div>
        </div>
    `;
    
    // Ishtirokchilarni yuklash
    loadParticipantsList();
    
    // Tugmalarga event listener qo'shish
    setTimeout(() => {
        const pickWinnersBtn = document.getElementById('pickWinnersBtn');
        const changeCriteriaBtn = document.getElementById('changeCriteriaBtn');
        
        if (pickWinnersBtn) {
            pickWinnersBtn.addEventListener('click', pickWinners);
        }
        
        if (changeCriteriaBtn) {
            changeCriteriaBtn.addEventListener('click', () => {
                loadAppStep('selectCriteria');
            });
        }
    }, 100);
}

// Ishtirokchilar ro'yxatini yuklash
function loadParticipantsList() {
    const participantsList = document.getElementById('participantsList');
    const participantsCount = document.getElementById('participantsCount');
    
    if (!participantsList || !participantsCount) return;
    
    // Mezon bo'yicha ishtirokchilarni filtrlash
    const filteredParticipants = appState.participants.filter(p => {
        switch(appState.selectedCriteria) {
            case 'comments':
                return p.comment !== null;
            case 'likes':
                return p.liked;
            case 'both':
                return p.comment !== null && p.liked;
            case 'followers':
                return p.follows;
            default:
                return true;
        }
    });
    
    appState.filteredParticipants = filteredParticipants;
    participantsCount.textContent = `${filteredParticipants.length} ta ishtirokchi topildi`;
    
    // Ishtirokchilarni ko'rsatish
    participantsList.innerHTML = '';
    
    filteredParticipants.forEach(participant => {
        const item = document.createElement('div');
        item.className = 'participant-item';
        item.id = `participant-${participant.id}`;
        
        item.innerHTML = `
            <div class="participant-info">
                <div class="participant-avatar">
                    <img src="${participant.profilePic}" alt="${participant.username}">
                </div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 5px;">@${participant.username}</div>
                    <div style="font-size: 14px; color: #8E8E8E; display: flex; gap: 10px; flex-wrap: wrap;">
                        ${participant.comment ? `<span title="${participant.comment}">💬 Koment qoldirdi</span>` : ''}
                        ${participant.liked ? '<span>❤️ Like bosdi</span>' : ''}
                        ${participant.follows ? '<span>✓ Obuna</span>' : ''}
                        <span>${participant.timestamp}</span>
                    </div>
                </div>
            </div>
            <div class="winner-badge" id="winnerBadge-${participant.id}">
                <i class="fas fa-crown"></i> G'olib
            </div>
        `;
        
        participantsList.appendChild(item);
    });
}

// G'oliblarni tanlash
function pickWinners() {
    if (!appState.filteredParticipants || appState.filteredParticipants.length < appState.winnersCount) {
        showNotification(`Faqat ${appState.filteredParticipants?.length || 0} ta mos ishtirokchi bor! G'oliblar sonini kamaytiring.`, 'error');
        return;
    }
    
    // Avvalgi g'olib belgilarini olib tashlash
    document.querySelectorAll('.winner-badge').forEach(badge => {
        badge.style.display = 'none';
    });
    
    // Tasodifiy g'oliblarni tanlash
    const shuffled = [...appState.filteredParticipants].sort(() => 0.5 - Math.random());
    appState.winners = shuffled.slice(0, appState.winnersCount);
    
    // G'olib belgilarini ko'rsatish
    appState.winners.forEach(winner => {
        const badge = document.getElementById(`winnerBadge-${winner.id}`);
        if (badge) {
            badge.style.display = 'flex';
        }
    });
    
    // Tanlash tugmasini yangilash
    const pickBtn = document.getElementById('pickWinnersBtn');
    if (pickBtn) {
        pickBtn.innerHTML = `<i class="fas fa-check"></i> ${appState.winnersCount} ta g'olib tanlandi!`;
        pickBtn.style.background = '#10B981';
        pickBtn.onclick = null;
        
        // Natijalarni ko'rish tugmasini qo'shish
        setTimeout(() => {
            const stepActions = document.querySelector('.step-actions');
            if (stepActions) {
                const resultsBtn = document.createElement('button');
                resultsBtn.className = 'btn-primary';
                resultsBtn.innerHTML = '<i class="fas fa-eye"></i> Natijalarni Ko\'rish';
                resultsBtn.onclick = () => loadAppStep('results');
                stepActions.appendChild(resultsBtn);
            }
        }, 500);
    }
    
    showNotification(`${appState.winnersCount} ta g'olib muvaffaqiyatli tanlandi!`, 'success');
}

// Natijalar qadamini yuklash
function loadResultsStep(container) {
    if (!appState.winners.length) {
        loadAppStep('pickWinners');
        return;
    }
    
    container.innerHTML = `
        <div class="step-container">
            <h1 class="step-title">Tanlov Natijalari</h1>
            <p class="step-subtitle">Tabriklaymiz! G'oliblar tanlandi</p>
            
            <div class="results-summary">
                <div style="background: linear-gradient(135deg, #f0f9ff, #e6f7ff); padding: 25px; border-radius: 15px; margin-bottom: 30px;">
                    <h3 style="margin-bottom: 15px; color: #121212;">Tanlov haqida ma'lumot:</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div style="background: white; padding: 15px; border-radius: 10px;">
                            <div style="color: #8E8E8E; font-size: 14px;">Post</div>
                            <div style="font-weight: 600; margin-top: 5px;">${appState.selectedPost?.caption.substring(0, 30)}...</div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 10px;">
                            <div style="color: #8E8E8E; font-size: 14px;">Mezonlar</div>
                            <div style="font-weight: 600; margin-top: 5px;">
                                ${appState.selectedCriteria === 'comments' ? 'Kommentlar' :
                                  appState.selectedCriteria === 'likes' ? 'Layklar' :
                                  appState.selectedCriteria === 'both' ? 'Ikkalasi' : 'Obunachilar'}
                            </div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 10px;">
                            <div style="color: #8E8E8E; font-size: 14px;">Jami ishtirokchilar</div>
                            <div style="font-weight: 600; margin-top: 5px;">${appState.filteredParticipants?.length || 0} kishi</div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 10px;">
                            <div style="color: #8E8E8E; font-size: 14px;">G'oliblar soni</div>
                            <div style="font-weight: 600; margin-top: 5px;">${appState.winnersCount} kishi</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin: 30px 0;">
                <h3 style="margin-bottom: 20px; color: #121212;">🏆 G'oliblar ro'yxati:</h3>
                <div id="winnersList">
                    <!-- G'oliblar shu yerga yuklanadi -->
                </div>
            </div>
            
            <div class="step-actions">
                <button class="btn-primary" id="downloadResultsBtn">
                    <i class="fas fa-download"></i> Natijalarni Yuklab Olish
                </button>
                <button class="btn-secondary" id="newGiveawayBtn">
                    <i class="fas fa-plus"></i> Yangi Tanlov
                </button>
                <button class="btn-secondary" id="shareResultsBtn">
                    <i class="fas fa-share-alt"></i> Ulashish
                </button>
            </div>
        </div>
    `;
    
    // G'oliblarni ko'rsatish
    loadWinnersList();
    
    // Tugmalarga event listener qo'shish
    setTimeout(() => {
        const downloadBtn = document.getElementById('downloadResultsBtn');
        const newGiveawayBtn = document.getElementById('newGiveawayBtn');
        const shareBtn = document.getElementById('shareResultsBtn');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadResults);
        }
        
        if (newGiveawayBtn) {
            newGiveawayBtn.addEventListener('click', () => {
                // State ni yangilash
                appState.selectedPost = null;
                appState.winners = [];
                appState.filteredParticipants = [];
                appState.winnersCount = 3;
                
                // Post tanlash qadamiga qaytish
                loadAppStep('selectPost');
            });
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: 'Instagram Tanlov Natijalari',
                        text: `${appState.winnersCount} ta g'olib tanlandi! InstaGiveaway orqali tanlov o'tkazing.`,
                        url: window.location.href
                    });
                } else {
                    showNotification('Brauzeringiz ulashishni qo\'llab-quvvatlamaydi', 'info');
                }
            });
        }
    }, 100);
}

// G'oliblar ro'yxatini yuklash
function loadWinnersList() {
    const winnersList = document.getElementById('winnersList');
    if (!winnersList) return;
    
    winnersList.innerHTML = '';
    
    appState.winners.forEach((winner, index) => {
        const winnerItem = document.createElement('div');
        winnerItem.className = 'participant-item';
        winnerItem.style.background = '#fff7ed';
        winnerItem.style.borderColor = '#F59E0B';
        
        winnerItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; background: gold; color: #856404; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">
                    ${index + 1}
                </div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 5px; color: #121212;">@${winner.username}</div>
                    <div style="font-size: 14px; color: #8E8E8E;">
                        ${winner.comment ? `"${winner.comment}"` : ''}
                        ${winner.liked ? ' ❤️' : ''}
                        ${winner.follows ? ' ✓ Obuna' : ''}
                    </div>
                </div>
            </div>
            <div style="background: gold; color: #856404; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                G'OLIB
            </div>
        `;
        
        winnersList.appendChild(winnerItem);
    });
}

// Natijalarni yuklab olish
function downloadResults() {
    if (!appState.winners.length) {
        showNotification('G\'oliblar mavjud emas!', 'error');
        return;
    }
    
    // Natijalar matnini tayyorlash
    let resultsText = `INSTAGRAM TANLOV NATIJALARI\n`;
    resultsText += `========================================\n\n`;
    resultsText += `Tanlov Sana: ${new Date().toLocaleDateString('uz-UZ')}\n`;
    resultsText += `Tanlov Vaqti: ${new Date().toLocaleTimeString('uz-UZ')}\n`;
    resultsText += `Tashkilotchi: @${appState.currentUser.username}\n`;
    resultsText += `Post: ${appState.selectedPost?.caption || 'Noma\'lum'}\n`;
    resultsText += `Tanlov Mezoni: ${appState.selectedCriteria === 'comments' ? 'Faqat komment qoldirganlar' :
                     appState.selectedCriteria === 'likes' ? 'Faqat layk bosganlar' :
                     appState.selectedCriteria === 'both' ? 'Komment va layk bosganlar' : 'Obunachilar'}\n`;
    resultsText += `Jami Ishtirokchilar: ${appState.filteredParticipants?.length || 0}\n`;
    resultsText += `G'oliblar Soni: ${appState.winnersCount}\n\n`;
    resultsText += `========================================\n`;
    resultsText += `G'OLIBLAR RO'YXATI:\n`;
    resultsText += `========================================\n\n`;
    
    appState.winners.forEach((winner, index) => {
        resultsText += `${index + 1}. @${winner.username}\n`;
        resultsText += `   - Komentariya: ${winner.comment || 'Yo\'q'}\n`;
        resultsText += `   - Like bosgan: ${winner.liked ? 'Ha' : 'Yo\'q'}\n`;
        resultsText += `   - Obunachi: ${winner.follows ? 'Ha' : 'Yo\'q'}\n`;
        resultsText += `   - Vaqt: ${winner.timestamp}\n\n`;
    });
    
    resultsText += `========================================\n`;
    resultsText += `Tanlov ID: GIV-${Date.now()}\n`;
    resultsText += `Berilgan: InstaGiveaway.com\n`;
    resultsText += `========================================\n`;
    
    // Fayl yaratish va yuklab olish
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-giveaway-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Natijalar yuklab olindi!', 'success');
}

// ===============================
// DOM CONTENT LOADED
// ===============================
document.addEventListener('DOMContentLoaded', initApp);

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
window.addEventListener('error', function(e) {
    console.error('Xatolik yuz berdi:', e.error);
    showNotification('Ilovada xatolik yuz berdi. Iltimos, sahifani yangilang.', 'error');
});

// ===============================
// OFFLINE MODE SUPPORT
// ===============================
window.addEventListener('offline', function() {
    showNotification('Internet aloqasi uzildi. Offline rejimda ishlaysiz.', 'warning');
});

window.addEventListener('online', function() {
    showNotification('Internet aloqasi tiklandi!', 'success');
});
