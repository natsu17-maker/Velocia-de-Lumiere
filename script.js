let cart = [];
let selectedSize = 'S';
let currentProduct = null;

const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartCountEl = document.getElementById('cart-count');
const cartTotalPriceEl = document.getElementById('cartTotalPrice');
const checkoutWhatsappBtn = document.getElementById('checkoutWhatsappBtn');

const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
});

cartToggleBtn.addEventListener('click', () => {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
});

closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
}

function addToCart(name, price, img, size) {
    const existingItem = cart.find(item => item.name === name && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, img, size, quantity: 1 });
    }
    updateCartUI();
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    cartCountEl.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-text">Your cart is currently empty.</p>`;
        cartTotalPriceEl.innerText = `IDR 0`;
        return;
    }

    let html = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        html += `
            <div class="cart-item-row">
                <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size} | Qty: ${item.quantity}</p>
                    <p>IDR ${Number(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    cartTotalPriceEl.innerText = `IDR ${Number(totalPrice).toLocaleString('id-ID')}`;
}

checkoutWhatsappBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang belanja Anda masih kosong.');
        return;
    }

    let message = "Halo Velocia de Lumière, saya ingin memesan produk berikut:\n\n";
    let total = 0;

    cart.forEach((item, i) => {
        message += `${i + 1}. *${item.name}* (Size: ${item.size}) - Qty: ${item.quantity} - IDR ${Number(item.price * item.quantity).toLocaleString('id-ID')}\n`;
        total += item.price * item.quantity;
    });

    message += `\n*Total Keseluruhan: IDR ${Number(total).toLocaleString('id-ID')}*\n\nMohon konfirmasi ketersediaan dan detail pembayarannya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/628XXXXXXXXXX?text=${encodedMessage}`, '_blank');
});

const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

function openDetailModal(button) {
    const card = button.closest('.product-card');
    currentProduct = {
        name: card.getAttribute('data-name'),
        price: Number(card.getAttribute('data-price')),
        desc: card.getAttribute('data-desc'),
        img: card.getAttribute('data-img')
    };

    modalTitle.innerText = currentProduct.name;
    modalPrice.innerText = `IDR ${Number(currentProduct.price).toLocaleString('id-ID')}`;
    modalDesc.innerText = currentProduct.desc;
    modalImg.src = currentProduct.img;

    productModal.classList.add('active');
}

closeModalBtn.addEventListener('click', () => {
    productModal.classList.remove('active');
});

productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.remove('active');
    }
});

function selectSize(btn, size) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSize = size;
}

modalAddToCartBtn.addEventListener('click', () => {
    if (currentProduct) {
        addToCart(currentProduct.name, currentProduct.price, currentProduct.img, selectedSize);
        productModal.classList.remove('active');
    }
});

const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const productCards = document.querySelectorAll('.product-card');

let activeCategory = 'all';

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter');
        filterProducts();
    });
});

if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
}

function filterProducts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const name = card.getAttribute('data-name').toLowerCase();

        const matchesCategory = (activeCategory === 'all' || category === activeCategory);
        const matchesSearch = name.includes(searchTerm);

        if (matchesCategory && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    scene.add(group);

    const geometry1 = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material1 = new THREE.MeshStandardMaterial({
        color: 0x222222,
        wireframe: true,
        roughness: 0.4,
        metalness: 0.8
    });
    const torusKnot = new THREE.Mesh(geometry1, material1);
    torusKnot.position.set(25, -5, -30);
    group.add(torusKnot);

    const geometry2 = new THREE.IcosahedronGeometry(8, 0);
    const material2 = new THREE.MeshStandardMaterial({
        color: 0xB38F6F,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });
    const icosahedron = new THREE.Mesh(geometry2, material2);
    icosahedron.position.set(-30, 15, -40);
    group.add(icosahedron);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x710014, 3, 50);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    camera.position.z = 30;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    });

    function animate() {
        requestAnimationFrame(animate);

        targetX = mouseX * 2;
        targetY = mouseY * 2;

        group.rotation.y += 0.002 + (targetX - group.rotation.y) * 0.05;
        group.rotation.x += 0.001 + (targetY - group.rotation.x) * 0.05;

        torusKnot.rotation.z += 0.005;
        icosahedron.rotation.y -= 0.007;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

const collabPopup = document.getElementById('collabPopup');
const closeCollabPopupBtn = document.getElementById('closeCollabPopupBtn');
const dismissCollabBtn = document.getElementById('dismissCollabBtn');
const exploreCollabBtn = document.getElementById('exploreCollabBtn');

function closeCollabModal() {
    if (collabPopup) {
        collabPopup.classList.remove('active');
        collabPopup.setAttribute('aria-hidden', 'true');
        sessionStorage.setItem('vdl_entelemi_promo_seen', 'true');
    }
}

if (collabPopup && !sessionStorage.getItem('vdl_entelemi_promo_seen')) {
    setTimeout(() => {
        collabPopup.classList.add('active');
        collabPopup.setAttribute('aria-hidden', 'false');
    }, 1500);
}

if (closeCollabPopupBtn) closeCollabPopupBtn.addEventListener('click', closeCollabModal);
if (dismissCollabBtn) dismissCollabBtn.addEventListener('click', closeCollabModal);
if (exploreCollabBtn) exploreCollabBtn.addEventListener('click', closeCollabModal);

if (collabPopup) {
    collabPopup.addEventListener('click', (e) => {
        if (e.target === collabPopup) {
            closeCollabModal();
        }
    });
}