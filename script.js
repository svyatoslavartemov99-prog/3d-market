if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

const defaultProducts = [
  { id: 1, title: "Шарнирный Кристальный Дракон (Шелк)", price: 590, oldPrice: 950, cat: "Драконы", rating: "4.9", img: "https://unsplash.com" },
  { id: 2, title: "Кликер-брелок Механическая Клавиша", price: 250, oldPrice: 400, cat: "Антистресс", rating: "5.0", img: "https://unsplash.com" },
  { id: 3, title: "Подвижный Аксолотль Милашка", price: 420, oldPrice: 650, cat: "Антистресс", rating: "4.8", img: "https://unsplash.com" },
  { id: 4, title: "Брелок-котик с подвижным хвостиком", price: 190, oldPrice: 320, cat: "Брелоки", rating: "4.9", img: "https://unsplash.com" }
];

let products = JSON.parse(localStorage.getItem('polyhub_products')) || defaultProducts;
let cart = [];
let currentCat = 'Все';
let isAdmin = false;
const ADMIN_PIN = "1234";

function saveProducts() {
  localStorage.setItem('polyhub_products', JSON.stringify(products));
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const query = document.getElementById('searchInput').value.toLowerCase();
  grid.innerHTML = '';

  const filtered = products.filter(p => {
    const matchCat = currentCat === 'Все' || p.cat === currentCat;
    const matchSearch = p.title.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  filtered.forEach(p => {
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${p.img}" alt="${p.title}">
        ${discount > 0 ? `<div class="discount-tag">-${discount}%</div>` : ''}
        <button class="del-btn" style="display: ${isAdmin ? 'block' : 'none'}" onclick="deleteProduct(${p.id})">✕</button>
      </div>
      <div class="card-body">
        <div class="price-row">
          <span class="price-now">${p.price} ₽</span>
          ${p.oldPrice ? `<span class="price-old">${p.oldPrice} ₽</span>` : ''}
        </div>
        <div class="card-title">${p.title}</div>
        <div class="card-meta">★ ${p.rating} • PLA Шелк</div>
        <button class="btn-buy" onclick="addToCart(${p.id})">В корзину</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function selectCat(cat, el) {
  currentCat = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  if (item) {
    cart.push(item);
    updateCart();
  }
}

function updateCart() {
  document.getElementById('cartBadge').innerText = cart.length;
  const list = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  
  if (cart.length === 0) {
    list.innerHTML = 'Корзина пока пуста';
    summary.style.display = 'none';
    return;
  }

  list.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += Number(item.price);
    list.innerHTML += `
      <div class="cart-item">
        <div>
          <div style="font-size:14px; font-weight:600;">${item.title}</div>
          <div style="font-size:13px; color:#40A7E3;">${item.price} ₽</div>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:var(--danger); font-size:16px; cursor:pointer;">🗑</button>
      </div>
    `;
  });

  document.getElementById('cartTotal').innerText = total + ' ₽';
  summary.style.display = 'block';
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function checkout() {
  alert('Заказ оформлен! В рабочей версии здесь откроется отправка заказа тебе в личные сообщения Telegram.');
  cart = [];
  updateCart();
}

function checkAdminCode() {
  const code = document.getElementById('adminCodeInput').value;
  if (code === ADMIN_PIN) {
    isAdmin = true;
    document.getElementById('adminLoginBox').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminBadge').style.display = 'block';
    renderProducts();
    alert('Доступ администратора открыт!');
  } else {
    alert('Неверный код доступа!');
  }
}

function logoutAdmin() {
  isAdmin = false;
  document.getElementById('adminLoginBox').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('adminBadge').style.display = 'none';
  document.getElementById('adminCodeInput').value = '';
  renderProducts();
}

function publishProduct() {
  const title = document.getElementById('newTitle').value;
  const price = document.getElementById('newPrice').value;
  const oldPrice = document.getElementById('newOldPrice').value;
  const cat = document.getElementById('newCat').value;
  let img = document.getElementById('newImg').value;

  if (!title || !price) {
    alert('Укажи хотя бы название и цену!');
    return;
  }

  if (!img) {
    img = "https://unsplash.com";
  }

  products.unshift({
    id: Date.now(),
    title: title,
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : null,
    cat: cat,
    rating: "5.0",
    img: img
  });

  saveProducts();
  renderProducts();

  document.getElementById('newTitle').value = '';
  document.getElementById('newPrice').value = '';
  document.getElementById('newOldPrice').value = '';
  document.getElementById('newImg').value = '';

  alert('Товар опубликован!');
  switchTab('home', document.querySelector('.nav-item'));
}

function deleteProduct(id) {
  if (confirm('Удалить этот товар?')) {
    products = products.filter(p => p.id !== id);
    saveProducts();
    renderProducts();
  }
}

function switchTab(tab, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
}

renderProducts();
