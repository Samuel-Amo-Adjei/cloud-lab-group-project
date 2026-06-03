/* ==============================================
   MARKETLY — script.js
   Plain JS. No frameworks. No dependencies.
=============================================== */

/* ===========================
   PRODUCT DATA
   To swap images: put your image files in an
   "images/" folder next to index.html, then
   update the "image" field below.
   e.g. image: "images/headphones.jpg"
=========================== */
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    category: "Electronics",
    description: "Experience industry-leading noise cancellation and superior sound quality with these premium wireless headphones.",
    image: "images/product-1.jpg",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Minimalist Leather Wallet",
    price: 45.00,
    category: "Accessories",
    description: "Sleek, durable, and elegant. This leather wallet is designed for the modern minimalist.",
    image: "images/product-2.jpg",
    rating: 4.5,
    reviews: 89,
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 199.00,
    category: "Electronics",
    description: "Track your health, workouts, and stay connected with this advanced smart fitness watch.",
    image: "images/product-3.jpg",
    rating: 4.7,
    reviews: 210,
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: 25.00,
    category: "Apparel",
    description: "Soft, breathable, and eco-friendly. The perfect everyday tee made from 100% organic cotton.",
    image: "images/product-4.jpg",
    rating: 4.3,
    reviews: 56,
  },
  {
    id: 5,
    name: "Professional DSLR Camera",
    price: 1200.00,
    category: "Electronics",
    description: "Capture stunning photos and videos with this high-resolution professional DSLR camera.",
    image: "images/product-5.jpg",
    rating: 4.9,
    reviews: 42,
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug",
    price: 18.00,
    category: "Home & Kitchen",
    description: "Handcrafted ceramic mug, perfect for your morning coffee or evening tea.",
    image: "images/product-6.jpg",
    rating: 4.6,
    reviews: 115,
  },
  {
    id: 7,
    name: "Ergonomic Office Chair",
    price: 350.00,
    category: "Furniture",
    description: "Maximum comfort for long working hours. Fully adjustable ergonomic design.",
    image: "images/product-7.jpg",
    rating: 4.4,
    reviews: 78,
  },
  {
    id: 8,
    name: "Portable Bluetooth Speaker",
    price: 89.99,
    category: "Electronics",
    description: "Compact size, powerful sound. Take your music anywhere with this water-resistant speaker.",
    image: "images/product-8.jpg",
    rating: 4.7,
    reviews: 320,
  },
];

/* ===========================
   STATE
=========================== */
let cart = JSON.parse(localStorage.getItem('marketly-cart') || '[]');
let currentPage = 'home';      // 'home' | 'shop' | 'product'
let currentProductId = null;
let shopCategory = 'All';
let shopSort = 'featured';
let shopView = 'grid';         // 'grid' | 'list'
let pdQty = 1;
let searchQuery = '';

/* ===========================
   PERSIST CART
=========================== */
function saveCart() {
  localStorage.setItem('marketly-cart', JSON.stringify(cart));
}

/* ===========================
   CART HELPERS
=========================== */
function getCartCount() {
  return cart.reduce((s, i) => s + i.quantity, 0);
}
function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.quantity, 0);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartUI();
  showToast('✅ ' + product.name + ' added to cart');
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  renderCartBody();
}

function updateQuantity(productId, newQty) {
  if (newQty < 1) { removeFromCart(productId); return; }
  const item = cart.find(i => i.id === productId);
  if (item) { item.quantity = newQty; }
  saveCart();
  updateCartUI();
  renderCartBody();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  renderCartBody();
}

/* ===========================
   CART UI
=========================== */
function updateCartUI() {
  const count = getCartCount();
  const badge = document.getElementById('cartBadge');
  badge.textContent = count;
  badge.classList.toggle('zero', count === 0);

  const total = document.getElementById('cartTotal');
  if (total) total.textContent = '$' + getCartTotal().toFixed(2);

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

function renderCartBody() {
  const body = document.getElementById('cartBody');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
      </div>`;
    return;
  }

  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item">
        <div class="cart-item-thumb">
          ${productImgTag(item.image, item.name, '')}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-top">
            <span class="cart-item-name">${item.name}</span>
            <button class="remove-btn" data-id="${item.id}" aria-label="Remove ${item.name}">✕</button>
          </div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="cart-qty-btn" data-action="dec" data-id="${item.id}">−</button>
            <span class="cart-qty-num">${item.quantity}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>`;
  });

  html += `<button class="clear-all-btn" id="clearAllBtn">Clear all items</button>`;
  body.innerHTML = html;

  // Bind events inside cart
  body.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
  });
  body.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const item = cart.find(i => i.id === id);
      if (!item) return;
      updateQuantity(id, item.quantity + (btn.dataset.action === 'inc' ? 1 : -1));
    });
  });
  const clearBtn = document.getElementById('clearAllBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);
}

/* ===========================
   CART OPEN / CLOSE
=========================== */
function openCart() {
  renderCartBody();
  updateCartUI();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

/* ===========================
   TOAST
=========================== */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ===========================
   IMAGE HELPER
   Shows a placeholder if image file is missing.
   Replace images/product-N.jpg with your files.
=========================== */
function productImgTag(src, alt, extraClass) {
  return `
    <img
      class="product-card-img ${extraClass}"
      src="${src}"
      alt="${alt}"
      loading="lazy"
      onerror="
        this.style.display='none';
        this.nextElementSibling.style.display='flex';
      "
    />
    <div class="product-card-img-placeholder" style="display:none">
      <span>🖼️</span>
      <small>Add image at<br><code>${src}</code></small>
    </div>`;
}

/* ===========================
   RENDER PRODUCT CARD
=========================== */
function createProductCard(product, isList) {
  const card = document.createElement('article');
  card.className = 'product-card' + (isList ? ' list-item' : '');
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    ${productImgTag(product.image, product.name, '')}
    <div class="product-card-body">
      <span class="product-card-category">${product.category}</span>
      <h3 class="product-card-name">${product.name}</h3>
      <div class="product-card-rating">
        <span class="star-filled">★</span>
        <span class="rating-num">${product.rating}</span>
        <span class="rating-count">(${product.reviews})</span>
      </div>
      ${isList ? `<p class="product-card-desc">${product.description}</p>` : ''}
      <div class="product-card-footer">
        <span class="product-price">$${product.price.toFixed(2)}</span>
        <button class="add-btn" data-id="${product.id}" aria-label="Add ${product.name} to cart">+</button>
      </div>
    </div>`;

  // Click card body → go to product page (not the add button)
  card.addEventListener('click', (e) => {
    if (e.target.closest('.add-btn')) return;
    navigateTo('product', product.id);
  });

  // Add to cart button
  card.querySelector('.add-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(product.id);
    const btn = e.currentTarget;
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = '', 200);
  });

  return card;
}

/* ===========================
   HOME PAGE
=========================== */
function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = '';
  grid.setAttribute('role', 'list');
  products.slice(0, 4).forEach(p => {
    grid.appendChild(createProductCard(p, false));
  });
}

/* ===========================
   SHOP PAGE
=========================== */
function getFilteredProducts() {
  let list = [...products];

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (shopCategory !== 'All') {
    list = list.filter(p => p.category === shopCategory);
  }

  // Sort
  switch (shopSort) {
    case 'price-low':  list.sort((a, b) => a.price - b.price); break;
    case 'price-high': list.sort((a, b) => b.price - a.price); break;
    case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
    default: break; // featured = original order
  }

  return list;
}

function renderCategories() {
  const list = document.getElementById('categoryList');
  if (!list) return;
  const cats = ['All', ...new Set(products.map(p => p.category))];
  list.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (shopCategory === cat ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      shopCategory = cat;
      renderShop();
    });
    list.appendChild(btn);
  });
}

function renderShop() {
  renderCategories();

  const grid = document.getElementById('shopGrid');
  const noResults = document.getElementById('noResults');
  const resultCount = document.getElementById('resultCount');
  if (!grid) return;

  const filtered = getFilteredProducts();
  resultCount.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    grid.innerHTML = '';
    grid.setAttribute('role', 'list');
    const isList = shopView === 'list';
    grid.classList.toggle('list-view', isList);
    filtered.forEach(p => grid.appendChild(createProductCard(p, isList)));
  }

  // Sync sort select
  const sortSel = document.getElementById('sortSelect');
  if (sortSel) sortSel.value = shopSort;

  // Sync view buttons
  document.getElementById('gridViewBtn').classList.toggle('active', shopView === 'grid');
  document.getElementById('listViewBtn').classList.toggle('active', shopView === 'list');
}

/* ===========================
   PRODUCT DETAIL PAGE
=========================== */
function renderProductDetail(id) {
  const product = products.find(p => p.id === id);
  if (!product) { navigateTo('shop'); return; }

  pdQty = 1;

  document.getElementById('pdCategory').textContent = product.category;
  document.getElementById('pdName').textContent = product.name;
  document.getElementById('pdRating').textContent = product.rating;
  document.getElementById('pdReviews').textContent = product.reviews + ' Customer Reviews';
  document.getElementById('pdPrice').textContent = '$' + product.price.toFixed(2);
  document.getElementById('pdQtyVal').textContent = pdQty;
  document.getElementById('pdDesc').textContent =
    product.description +
    '\n\nOur products are designed with the highest quality materials and a focus on durability and style. Whether you\'re looking for a professional tool or a casual accessory, this product delivers unmatched performance.';

  // Main image
  const mainImgWrap = document.getElementById('pdMainImg');
  mainImgWrap.parentElement.innerHTML = `
    <div class="product-img-main">
      ${productImgTag(product.image, product.name, '')}
    </div>`;

  // Thumbs (4 × same image)
  const thumbs = document.getElementById('pdThumbs');
  thumbs.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    thumbs.innerHTML += `
      <div class="thumb">
        <img src="${product.image}" alt="${product.name} view ${i + 1}"
          onerror="this.style.display='none'"
        />
      </div>`;
  }
}

/* ===========================
   ROUTING / NAVIGATION
=========================== */
function navigateTo(page, productId) {
  currentPage = page;
  currentProductId = productId || null;

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

  if (page === 'home') {
    document.getElementById('page-home').classList.remove('hidden');
    window.scrollTo(0, 0);
  } else if (page === 'shop') {
    document.getElementById('page-shop').classList.remove('hidden');
    renderShop();
    window.scrollTo(0, 0);
  } else if (page === 'product') {
    document.getElementById('page-product').classList.remove('hidden');
    renderProductDetail(productId);
    window.scrollTo(0, 0);
  }
}

/* ===========================
   BIND STATIC ELEMENTS
=========================== */
function bindNav() {
  // Logo → home
  document.getElementById('logoLink').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });

  // Shop link in nav
  document.getElementById('shopNavLink').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('shop');
  });

  // Mobile menu
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('open');
  });
  document.getElementById('mobileShopLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mobileMenu').classList.remove('open');
    navigateTo('shop');
  });
  document.getElementById('mobileHomeLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mobileMenu').classList.remove('open');
    navigateTo('home');
  });

  // Cart
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    closeCart();
    clearCart();
    showToast('🎉 Order placed! Thank you for shopping with us.');
  });

  // Escape key closes cart
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
}

function bindHome() {
  document.getElementById('heroShopBtn').addEventListener('click', () => navigateTo('shop'));
  document.getElementById('viewAllBtn').addEventListener('click', () => navigateTo('shop'));
}

function bindShop() {
  // Sort
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    shopSort = e.target.value;
    renderShop();
  });

  // View toggle
  document.getElementById('gridViewBtn').addEventListener('click', () => {
    shopView = 'grid';
    renderShop();
  });
  document.getElementById('listViewBtn').addEventListener('click', () => {
    shopView = 'list';
    renderShop();
  });
}

function bindProductDetail() {
  document.getElementById('backBtn').addEventListener('click', () => navigateTo('shop'));

  document.getElementById('pdQtyMinus').addEventListener('click', () => {
    if (pdQty > 1) {
      pdQty--;
      document.getElementById('pdQtyVal').textContent = pdQty;
    }
  });
  document.getElementById('pdQtyPlus').addEventListener('click', () => {
    pdQty++;
    document.getElementById('pdQtyVal').textContent = pdQty;
  });

  document.getElementById('pdAddCart').addEventListener('click', () => {
    if (!currentProductId) return;
    for (let i = 0; i < pdQty; i++) addToCart(currentProductId);
  });
}

function bindSearch() {
  const input = document.getElementById('searchInput');
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchQuery = input.value.trim();
      if (searchQuery) {
        shopCategory = 'All';
        navigateTo('shop');
      }
    }, 280);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchQuery = input.value.trim();
      shopCategory = 'All';
      navigateTo('shop');
    }
  });
}

/* ===========================
   INIT
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  bindNav();
  bindHome();
  bindShop();
  bindProductDetail();
  bindSearch();

  renderFeatured();
  updateCartUI();

  // Start on home
  navigateTo('home');
});
