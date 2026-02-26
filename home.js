let products = JSON.parse(localStorage.getItem("products")) || [
  { id: "p1", name: "Laptop Gaming", price: 25000000, category: "gaming", info: "Laptop gaming hiệu năng cao, thiết kế hầm hố, màn hình 144Hz, RGB, tản nhiệt tốt.", img: "https://i.postimg.cc/8kH2R25r/OIP.webp" },
  { id: "p2", name: "Chuột Gaming", price: 350000, category: "phukien", info: "Chuột gaming có dây, cảm biến chính xác, nhiều nút bấm tùy chỉnh, đèn RGB.", img: "https://i.postimg.cc/fbD7frkK/OIP.webp" },
  { id: "p3", name: "Bàn phím cơ", price: 1200000, category: "phukien", info: "Bàn phím cơ switch đỏ, thiết kế đẹp, đèn RGB, chống nước, phù hợp chơi game và gõ phím.", img: "https://i.postimg.cc/B6y1kYZg/BP-1-2048x1010.jpg" },
  { id: "p4", name: "Tai nghe gaming", price: 1200000, category: "phukien", info: "Tai nghe gaming có dây, âm thanh ảo 7.1, đèn RGB, phù hợp chơi game và nghe nhạc.", img: "https://i.postimg.cc/h4rMpYqk/OIP.webp" }
];
localStorage.setItem("products", JSON.stringify(products));

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentUser = localStorage.getItem("currentUser");
  if (!isLoggedIn || !currentUser) {
    window.location.href = "index.html";
    return;
  }
  const userBox = document.getElementById("username");
  if (userBox) userBox.innerText = currentUser;

  loadTheme();
  if (document.getElementById("productList")) renderProducts();
  renderCart();
  updateCartBadge();
  initProductDetail();
});

function updateCartBadge() {
  const countBox = document.getElementById("cartCount");
  if (countBox) {
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
    countBox.innerText = totalQty;
    countBox.style.display = totalQty > 0 ? "inline-block" : "none";
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartBadge();
  if (document.getElementById("productList")) renderProducts();
}

function addToCart(p) {
  const item = cart.find(i => i.id === p.id);
  item ? item.qty++ : cart.push({ ...p, qty: 1 });
  saveCart();
  alert(`Đã thêm "${p.name}" vào giỏ!`);
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function renderCart() {
  const box = document.getElementById("cartItems");
  const totalBox = document.getElementById("totalPrice");
  if (!box || !totalBox) return;
  box.innerHTML = "";
  let total = 0;
  cart.forEach(i => {
    total += i.price * i.qty;
    box.innerHTML += `
      <div class="cart-item">
        <img src="${i.img}">
        <div style="flex: 1; margin-left: 10px;">
          <strong>${i.name}</strong><br>
          <div class="qty-controls" style="margin-top: 5px; display: flex; align-items: center; gap: 8px;">
            <button onclick="updateQty('${i.id}', -1)">-</button>
            <span>${i.qty}</span>
            <button onclick="updateQty('${i.id}', 1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart('${i.id}')">✕</button>
      </div>`;
  });
  box.innerHTML += `
    <hr style="margin:15px 0; border:0.5px solid #444">
    <div class="cart-checkout-form">
      <h3>Thông tin giao hàng</h3>
      <input type="text" id="receiverName" placeholder="Tên người nhận">
      <input type="text" id="receiverPhone" placeholder="Số điện thoại">
      <textarea id="receiverAddress" placeholder="Địa chỉ giao hàng"></textarea>
      <button class="btn-pay" onclick="processCheckout()">MUA HÀNG</button>
    </div>`;
  totalBox.innerText = total.toLocaleString();
}

function renderProducts() {
  const list = document.getElementById("productList");
  if (!list) return;
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filter").value;
  list.innerHTML = "";
  products.filter(p => (filter === "all" || p.category === filter) && p.name.toLowerCase().includes(search))
    .forEach(p => {
      list.innerHTML += `
        <div class="product">
          <div class="product-img">
            <img src="${p.img}">
            <div class="img-overlay" onclick="viewDetail('${p.id}')">Xem chi tiết</div>
          </div>
          <h3>${p.name}</h3>
          <p class="price">${p.price.toLocaleString()}đ</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>Thêm vào giỏ</button>
        </div>`;
    });
}

function viewDetail(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    localStorage.setItem("currentProduct", JSON.stringify(product));
    window.location.href = "product-detail.html";
  }
}

function initProductDetail() {
  const nameEl = document.getElementById("productName");
  if (!nameEl) return;
  const product = JSON.parse(localStorage.getItem("currentProduct"));
  if (!product) return;
  nameEl.innerText = product.name;
  document.getElementById("productImg").src = product.img;
  document.getElementById("productPrice").innerText = product.price.toLocaleString() + "đ";
  document.getElementById("productInfo").innerText = product.info || "Mô tả đang cập nhật";
  document.getElementById("addBtn").onclick = () => addToCart(product);
}

function processCheckout() {
  const name = document.getElementById("receiverName").value;
  const phone = document.getElementById("receiverPhone").value;
  const address = document.getElementById("receiverAddress").value;
  if (cart.length === 0 || !name || !phone || !address) {
    alert("Vui lòng kiểm tra giỏ hàng và điền đủ thông tin!");
    return;
  }
  localStorage.removeItem("cart");
  window.location.href = "thank-you.html";
}

function toggleCart() { document.getElementById("cart").classList.toggle("active"); }
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}
function loadTheme() { if (localStorage.getItem("theme") === "light") document.body.classList.add("light"); }
function logout() { localStorage.removeItem("isLoggedIn"); localStorage.removeItem("currentUser"); window.location.href = "index.html"; }
function toggleProfile() { 
  const overlay = document.getElementById("profileOverlay");
  overlay.classList.toggle("active");
  if(overlay.classList.contains("active")) document.getElementById("profileUser").value = localStorage.getItem("currentUser") || "Khách";
}
function showChangePassForm() { document.getElementById("passwordArea").style.display = "none"; document.getElementById("changePassForm").style.display = "block"; }
function hideChangePassForm() { document.getElementById("passwordArea").style.display = "block"; document.getElementById("changePassForm").style.display = "none"; }
function saveNewPass() {
  const newPass = document.getElementById("newPass").value;
  const confirmPass = document.getElementById("confirmPass").value;
  if (!newPass || newPass !== confirmPass) { alert("Mật khẩu không khớp hoặc trống!"); return; }
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userIndex = users.findIndex(u => u.username === localStorage.getItem("currentUser"));
  if (userIndex !== -1) {
    users[userIndex].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đổi mật khẩu thành công!");
    hideChangePassForm();
  }
}