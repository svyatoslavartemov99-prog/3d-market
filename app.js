function addToCart(id, color) {
  const item = products.find(p => p.id === id);
  if (item) {
    cart.push({ ...item, chosenColor: color || availableColors[0] });
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
          <div style="font-size:12px; color:#8E8E93; margin:2px 0;">Цвет: ${item.chosenColor}</div>
          <div style="font-size:13px; color:#40A7E3; font-weight:600;">${item.price} ₽</div>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:var(--danger); font-size:18px; cursor:pointer;">🗑</button>
      </div>`;
  });
  document.getElementById('cartTotal').innerText = total + ' ₽';
  summary.style.display = 'block';
}

function removeFromCart(index) { cart.splice(index, 1); updateCart(); }
function checkout() { alert('Заказ оформлен!'); cart = []; updateCart(); }

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX = 600;
      let w = img.width, h = img.height;
      if (w > h && w > MAX) { h *= MAX / w; w = MAX; }
      else if (h > MAX) { w *= MAX / h; h = MAX; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      uploadedImageBase64 = canvas.toDataURL('image/jpeg', 0.78);
      const preview = document.getElementById('imgPreview');
      preview.src = uploadedImageBase64;
      preview.style.display = 'block';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function checkAdminCode() {
  if (document.getElementById('adminCodeInput').value === ADMIN_PIN) {
    isAdmin = true;
    document.getElementById('adminLoginBox').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminBadge').style.display = 'block';
    renderProducts();
  } else { alert('Неверный код!'); }
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
  const desc = document.getElementById('newDesc').value;
  if (!title || !price) { alert('Укажи название и цену!'); return; }

  products.unshift({
    id: Date.now(), title, price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : null,
    cat, rating: "5.0", emoji: getEmojiByCat(cat),
    img: uploadedImageBase64, desc
  });
  saveProducts(); renderProducts();
  document.getElementById('newTitle').value = '';
  document.getElementById('newPrice').value = '';
  document.getElementById('newOldPrice').value = '';
  document.getElementById('newDesc').value = '';
  document.getElementById('imgPreview').style.display = 'none';
  uploadedImageBase64 = "";
  alert('Товар опубликован!');
  switchTab('home', document.querySelector('.nav-item'));
}

function deleteProduct(id) {
  if (confirm('Удалить товар?')) {
    products = products.filter(p => p.id !== id);
    saveProducts(); renderProducts();
  }
}

function switchTab(tab, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
}

renderProducts();
