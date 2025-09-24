document.addEventListener('DOMContentLoaded', function() {
  let cart = [];
  
  // Update tampilan keranjang
  function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    // Hitung total item
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Kosongkan tampilan
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<p style="text-align:center; color:#666; padding: 2rem 0;">Keranjang kosong</p>';
      cartTotal.textContent = 'Rp 0';
      return;
    }
    
    // Tampilkan item
    let totalPrice = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      
      cartItems.innerHTML += `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>Rp ${item.price.toLocaleString('id-ID')} × <strong>${item.quantity}</strong></p>
          </div>
          <div>
            <span class="cart-item-price">Rp ${itemTotal.toLocaleString('id-ID')}</span>
            <button class="remove-item" data-id="${item.id}">×</button>
          </div>
        </div>
      `;
    });
    
    cartTotal.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
  }
  
  // Tambah ke keranjang
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      const card = e.target.closest('[data-name]');
      if (!card) return;
      
      const name = card.getAttribute('data-name');
      const price = parseInt(card.getAttribute('data-price'));
      
      if (!name || isNaN(price)) {
        alert("Data produk tidak lengkap!");
        return;
      }
      
      const id = name.replace(/\s+/g, '-').toLowerCase();
      const existing = cart.find(item => item.id === id);
      
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }
      
      updateCart();
      
      // Tampilkan notifikasi
      const notif = document.createElement('div');
      notif.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #1e3a8a; color: white; padding: 12px 20px;
        border-radius: 8px; z-index: 4000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500; font-family: 'Poppins', sans-serif;
      `;
      notif.textContent = '✅ Ditambahkan ke keranjang!';
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 2000);
    }
  });
  
  // Hapus item
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-item')) {
      const id = e.target.getAttribute('data-id');
      cart = cart.filter(item => item.id !== id);
      updateCart();
    }
  });
  
  // Buka/tutup keranjang
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  
  if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', e => {
      e.preventDefault();
      cartModal.style.display = 'block';
    });
    
    document.querySelector('.close-cart').addEventListener('click', () => {
      cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', e => {
      if (e.target === cartModal) {
        cartModal.style.display = 'none';
      }
    });
  }
  
  // Checkout WhatsApp
  document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    
    let message = "Halo Captain Davy Jones! Saya ingin memesan:\n\n";
    let total = 0;
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      message += `• ${item.name} × ${item.quantity} = Rp ${itemTotal.toLocaleString('id-ID')}\n`;
    });
    
    message += `\nTotal: Rp ${total.toLocaleString('id-ID')}\n\nSilakan kirim invoice atau konfirmasi pembayaran.`;
    
    const waNumber = '6285714196664';
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
  });
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.close-menu');
  
  if (mobileMenuToggle && mobileMenu && closeMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
    
    closeMenu.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
    
    // Tutup menu saat klik link
    document.querySelectorAll('.mobile-menu nav a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }
  
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Inisialisasi
  updateCart();
});