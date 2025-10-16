// Данные товаров
const products = [
    {
        id: 1,
        name: "Умные часы Premium",
        description: "Смарт-часы с функцией отслеживания здоровья",
        price: 12990,
        category: "electronics",
        rating: 5,
        badge: "Хит продаж"
        image: "Watchsfs.jpeg"
    },
    {
        id: 2,
        name: "Беспроводные наушники",
        description: "Качество звука премиум-класса",
        price: 8490,
        category: "electronics",
        rating: 4,
        badge: null
        image: "headphonesfs.webp"
    },
    {
        id: 3,
        name: "Кожаный рюкзак",
        description: "Стильный и практичный аксессуар",
        price: 5990,
        category: "clothing",
        rating: 5,
        badge: "Новинка"
        image: "rukzak.jpg"
    },
    {
        id: 4,
        name: "Фитнес-браслет Pro",
        description: "Отслеживание активности и сна",
        price: 3290,
        category: "electronics",
        rating: 4,
        badge: null
        image: "fitbrfs.jpg"
    },
    {
        id: 5,
        name: "Кофемашина Compact",
        description: "Идеальный кофе каждое утро",
        price: 21990,
        category: "home",
        rating: 5,
        badge: null
        image: "coffeemfs.webp"
    },
    {
        id: 6,
        name: "Электронная книга",
        description: "Бережное для глаз чтение",
        price: 6790,
        category: "electronics",
        rating: 4,
        badge: "Выбор редакции"
        image: "ebookfs.jpg"
    }
];

// Корзина
let cart = [];
let contactsTriggerElement = null;

// Слайдер
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const slideInterval = 6000;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

// Автопереключение слайдов
let slideTimer = setInterval(nextSlide, slideInterval);

// Обработчики для точек слайдера
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideTimer);
        showSlide(index);
        slideTimer = setInterval(nextSlide, slideInterval);
    });
});

// Шторка меню
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');

function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
if (closeSidebar) closeSidebar.addEventListener('click', toggleSidebar);
if (overlay) overlay.addEventListener('click', toggleSidebar);

// Корзина
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

function toggleCart() {
    if (cartSidebar && overlay) {
        cartSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }
}

function updateCart() {
    if (!cartCount || !cartItems || !cartTotal) return;
    
    // Обновляем счетчик корзины
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Обновляем содержимое корзины
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        cartTotal.textContent = '0 ₽';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽ × ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">✕</button>
        `;
        if (cartItems) cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = total.toLocaleString() + ' ₽';
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removeFromCart(id);
        });
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification(product.name);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function showCartNotification(productName) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <span>${productName} добавлен в корзину!</span>
    `;
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Убираем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

if (cartBtn) cartBtn.addEventListener('click', toggleCart);
if (closeCart) closeCart.addEventListener('click', toggleCart);

// Закрытие по ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (sidebar && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    }
});

// Смена темы
const themeToggles = document.querySelectorAll('.theme-checkbox');
const currentTheme = localStorage.getItem('theme') || 'light';

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Устанавливаем состояние переключателей
    themeToggles.forEach(toggle => {
        toggle.checked = theme === 'dark';
    });
}

// Установка начальной темы
setTheme(currentTheme);

themeToggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
        setTheme(toggle.checked ? 'dark' : 'light');
    });
});

// Всплывающее окно контактов
const contactsTriggers = document.querySelectorAll('.contacts-trigger');
const contactsPopup = document.getElementById('contactsPopup');
let contactsTimer;

function updateContactsPopupPosition() {
    if (!contactsTriggerElement || !contactsPopup || !contactsPopup.classList.contains('show')) return;
    
    const rect = contactsTriggerElement.getBoundingClientRect();
    contactsPopup.style.left = rect.left + 'px';
    contactsPopup.style.top = (rect.bottom + window.scrollY) + 'px';
}

if (contactsTriggers.length > 0 && contactsPopup) {
    contactsTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', (e) => {
            clearTimeout(contactsTimer);
            contactsTriggerElement = e.currentTarget;
            updateContactsPopupPosition();
            contactsPopup.classList.add('show');
        });

        trigger.addEventListener('mouseleave', () => {
            contactsTimer = setTimeout(() => {
                contactsPopup.classList.remove('show');
            }, 300);
        });
    });

    // Обновляем позицию попапа при скролле
    window.addEventListener('scroll', updateContactsPopupPosition);
    window.addEventListener('resize', updateContactsPopupPosition);

    // Закрытие попапа при клике вне его
    contactsPopup.addEventListener('mouseenter', () => {
        clearTimeout(contactsTimer);
    });

    contactsPopup.addEventListener('mouseleave', () => {
        contactsTimer = setTimeout(() => {
            contactsPopup.classList.remove('show');
        }, 300);
    });
}

// Плавная прокрутка для навигации
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Закрываем шторку если открыта
            if (sidebar && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
            
            // Плавная прокрутка
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Обработчик для логотипа (возврат на главную)
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        const homeSection = document.querySelector('#home');
        if (homeSection) {
            homeSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Фильтр по цене
const priceFilterTrigger = document.getElementById('priceFilterTrigger');
const priceFilterDropdown = document.getElementById('priceFilterDropdown');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const categoryFilter = document.getElementById('categoryFilter');
const ratingFilter = document.getElementById('ratingFilter');

// Открытие/закрытие фильтра по цене
if (priceFilterTrigger && priceFilterDropdown) {
    priceFilterTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        priceFilterDropdown.classList.toggle('show');
        priceFilterTrigger.classList.toggle('active');
    });

    // Закрытие фильтра по цене при клике вне его
    document.addEventListener('click', (e) => {
        if (priceFilterTrigger && priceFilterDropdown && 
            !priceFilterTrigger.contains(e.target) && 
            !priceFilterDropdown.contains(e.target)) {
            priceFilterDropdown.classList.remove('show');
            priceFilterTrigger.classList.remove('active');
        }
    });
}

// Валидация ввода цены
if (minPriceInput && maxPriceInput) {
    [minPriceInput, maxPriceInput].forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value > 100000) value = 100000;
            e.target.value = value;
            
            // Обновление плейсхолдера
            updatePricePlaceholder();
        });
    });
}

function updatePricePlaceholder() {
    if (!priceFilterTrigger || !minPriceInput || !maxPriceInput) return;
    
    const min = minPriceInput.value || '0';
    const max = maxPriceInput.value || '100000';
    const placeholder = priceFilterTrigger.querySelector('.price-placeholder');
    if (placeholder) {
        placeholder.textContent = `${min} - ${max} руб`;
    }
}

// Отображение товаров
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">Товары не найдены</div>';
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <button class="add-to-cart" data-id="${product.id}">В корзину</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Добавляем обработчики для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
            }
        });
    });
}

// Фильтрация товаров
function filterProducts() {
    if (!categoryFilter || !ratingFilter || !minPriceInput || !maxPriceInput) return;
    
    const category = categoryFilter.value;
    const rating = ratingFilter.value;
    const minPrice = parseInt(minPriceInput.value) || 0;
    const maxPrice = parseInt(maxPriceInput.value) || 100000;

    const filteredProducts = products.filter(product => {
        // Фильтр по категории
        if (category !== 'all' && product.category !== category) {
            return false;
        }

        // Фильтр по рейтингу
        if (rating !== 'all' && product.rating < parseInt(rating)) {
            return false;
        }

        // Фильтр по цене
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }

        return true;
    });

    renderProducts(filteredProducts);
}

// Сброс фильтров
function resetFilters() {
    if (!categoryFilter || !ratingFilter || !minPriceInput || !maxPriceInput || !priceFilterTrigger) return;
    
    categoryFilter.value = 'all';
    ratingFilter.value = 'all';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    const placeholder = priceFilterTrigger.querySelector('.price-placeholder');
    if (placeholder) {
        placeholder.textContent = 'Выберите диапазон';
    }
    if (priceFilterDropdown) {
        priceFilterDropdown.classList.remove('show');
    }
    if (priceFilterTrigger) {
        priceFilterTrigger.classList.remove('active');
    }
    
    renderProducts(products);
}

// Инициализация фильтров
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', filterProducts);
}

if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetFilters);
}

// Закрытие dropdown при ресайзе (для мобильных)
window.addEventListener('resize', () => {
    if (priceFilterDropdown && priceFilterTrigger) {
        priceFilterDropdown.classList.remove('show');
        priceFilterTrigger.classList.remove('active');
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCart();
    
    // Инициализация темы
    setTheme(currentTheme);
});

// Стили для уведомления корзины
const cartNotificationStyles = `
.cart-notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--primary);
    color: var(--bg-white);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: var(--shadow);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 3000;
    font-weight: 500;
}

.cart-notification.show {
    transform: translateX(0);
}

.no-products {
    text-align: center;
    color: var(--text-light);
    padding: 3rem;
    font-size: 1.2rem;
    grid-column: 1 / -1;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = cartNotificationStyles;
document.head.appendChild(styleSheet);


