/* ===== AUTH CHECK ===== */
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentUser = localStorage.getItem("currentUser");
  if (!isLoggedIn || !currentUser) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "index.html";
    return;
  }
  const userBox = document.getElementById("username");
  if (userBox) userBox.innerText = currentUser;
  loadTheme();
  renderProducts();
  renderCart();
});
/* ===== PRODUCTS DATA ===== */
/* ================== LOAD PRODUCTS ================== */
let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: "p1",
    name: "Laptop Gaming",
    price: 25000000,
    category: "gaming",
    info: "Laptop gaming hiệu năng cao, thiết kế hầm hố, màn hình 144Hz, RGB, tản nhiệt tốt.",
    img: "https://i.postimg.cc/8kH2R25r/OIP.webp"
  },
  {
    id: "p2",
    name: "Chuột Gaming",
    price: 350000,
    category: "phukien",
    info: "Chuột gaming có dây, cảm biến chính xác, nhiều nút bấm tùy chỉnh, đèn RGB.",
    img: "https://i.postimg.cc/fbD7frkK/OIP.webp"
  },
  {
    id: "p3",
    name: "Bàn phím cơ",
    price: 1200000,
    category: "phukien",
    info: "Bàn phím cơ switch đỏ, thiết kế đẹp, đèn RGB, chống nước, phù hợp chơi game và gõ phím.",
    img: "https://i.postimg.cc/B6y1kYZg/BP-1-2048x1010.jpg"
  }
];

// đảm bảo luôn lưu vào localStorage
localStorage.setItem("products", JSON.stringify(products));
/* ===== CART ===== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}
function addToCart(p) {
  const item = cart.find(i => i.id === p.id);
  item ? item.qty++ : cart.push({ ...p, qty: 1 });
  saveCart();
}
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}
function toggleCart() {
  document.getElementById("cart").classList.toggle("active");
}
function renderCart() {
  const box = document.getElementById("cartItems");
  const totalBox = document.getElementById("totalPrice");
  box.innerHTML = "";
  let total = 0;
  cart.forEach(i => {
    total += i.price * i.qty;
    box.innerHTML += `
      <div class="cart-item">
        <img src="${i.img}">
        <div>
          <strong>${i.name}</strong><br>
          x${i.qty}
        </div>
        <button onclick="removeFromCart('${i.id}')">✕</button>
      </div>
    `;
  });
  /* ===== FORM THANH TOÁN (PHẦN BỊ THIẾU) ===== */
  box.innerHTML += `
    <hr style="margin:15px 0; border:0.5px solid #444">
    <div class="cart-checkout-form">
      <h3>Thông tin giao hàng</h3>
      <input type="text" id="receiverName" placeholder="Tên người nhận">
      <input type="text" id="receiverPhone" placeholder="Số điện thoại">
      <textarea id="receiverAddress" placeholder="Địa chỉ giao hàng"></textarea>
      <button class="btn-pay" onclick="processCheckout()">
        MUA HÀNG
      </button>
    </div>
  `;
  totalBox.innerText = total.toLocaleString();
}
/* ===== RENDER PRODUCTS ===== */
function renderProducts() {
  const list = document.getElementById("productList");
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filter").value;

  list.innerHTML = "";

  products
    .filter(p =>
      (filter === "all" || p.category === filter) &&
      p.name.toLowerCase().includes(search)
    )
    .forEach(p => {
list.innerHTML += `
  <div class="product">
    <div class="product-img">
      <img src="${p.img}">
      <div 
        class="img-overlay" 
        onclick="viewDetail('${p.id}')"
      >
        Xem chi tiết
      </div>
    </div>

    <h3>${p.name}</h3>
    <p class="price">${p.price.toLocaleString()}đ</p>

    <button onclick='addToCart(${JSON.stringify(p)})'>
      Thêm vào giỏ
    </button>
  </div>
`;
    });
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderProducts(); // ✅ cập nhật giá + số lượng
}
/* ===== THEME ===== */
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}
function loadTheme() {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }
}
/* ===== LOGOUT ===== */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function viewDetail(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  localStorage.setItem("currentProduct", JSON.stringify(product));
  window.location.href = "product-detail.html";
}
/* ===== PROFILE LOGIC ===== */

// Hàm đóng/mở trang Profile
function toggleProfile() {
  const overlay = document.getElementById("profileOverlay");
  overlay.classList.toggle("active");
  
  if(overlay.classList.contains("active")) {
    const currentUser = localStorage.getItem("currentUser");
    document.getElementById("profileUser").value = currentUser || "Khách";
  }
}

// Hàm để bấm ra ngoài cái bảng thì đóng lại
function closeProfileOutside(event) {
  if (event.target.id === "profileOverlay") {
    toggleProfile();
  }
}

// Gán cho nút Profile trên Navbar
function openProfile() {
  toggleProfile();
}
// Cập nhật lại hàm Logout một chút để tránh xóa sạch dữ liệu sản phẩm
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
// Hiện form nhập mật khẩu mới
function showChangePassForm() {
  document.getElementById("passwordArea").style.display = "none";
  document.getElementById("changePassForm").style.display = "block";
}

// Ẩn form về lại như cũ
function hideChangePassForm() {
  document.getElementById("passwordArea").style.display = "block";
  document.getElementById("changePassForm").style.display = "none";
}

// Hàm lưu mật khẩu mới
function saveNewPass() {
  const newPass = document.getElementById("newPass").value;
  const confirmPass = document.getElementById("confirmPass").value;
  const currentUser = localStorage.getItem("currentUser");

  if (newPass === "" || confirmPass === "") {
    alert("Vui lòng không để trống mật khẩu!");
    return;
  }

  if (newPass !== confirmPass) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  // Giả sử bạn lưu thông tin user trong mảng users ở localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  
  // Tìm user hiện tại trong danh sách để cập nhật mật khẩu
  let userIndex = users.findIndex(u => u.username === currentUser);
  
  if (userIndex !== -1) {
    users[userIndex].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đổi mật khẩu thành công!");
    hideChangePassForm();
    // Xóa trắng input để lần sau mở lại không bị dính
    document.getElementById("newPass").value = "";
    document.getElementById("confirmPass").value = "";
  } else {
    alert("Lỗi: Không tìm thấy tài khoản để cập nhật!");
  }
}