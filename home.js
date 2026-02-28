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
function openProfile() { 
  const overlay = document.getElementById("profileOverlay");
  if (overlay) {
    overlay.classList.add("active");
    document.getElementById("profileUser").value = localStorage.getItem("currentUser") || "Khách";
  }
}
function toggleProfile() {
  document.getElementById("profileOverlay").classList.remove("active");
  hideChangePassForm(); // Reset lại form đổi pass khi đóng
}
function toggleProfile() {
  document.getElementById("profileOverlay").classList.remove("active");
  hideChangePassForm(); // Reset lại form đổi pass khi đóng
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
// 1. Dữ liệu Tin tức (giống như mảng products)
let newsList = [
  {
    id: "n1",
    title: "Top 5 Laptop Gaming đáng mua nhất 2026",
    summary: "Khám phá danh sách những mẫu laptop sở hữu card đồ họa RTX 50-series mới nhất...",
    content: "Nội dung chi tiết bài viết về Laptop Gaming...", // Bạn có thể thêm nội dung dài ở đây
    img: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500",
content: `
    <p>Năm 2026 đánh dấu bước ngoặt lớn của làng Laptop Gaming với sự xuất hiện của dòng card đồ họa Blackwell thế hệ mới. Dưới đây là 5 cái tên xuất sắc nhất do ForsakenShop bình chọn:</p>

    <div style="margin-bottom: 25px;">
      <h3 style="color: var(--primary);">1. ROG Zephyrus G16 (2026 Edition)</h3>
      <p><b>Thông số:</b> RTX 5070, Intel Core Ultra 9, RAM 32GB LPDDR5X.</p>
      <p>Vẫn giữ ngôi vương về thiết kế sang trọng, Zephyrus G16 năm nay mỏng hơn nhưng lại mát hơn nhờ hệ thống tản nhiệt buồng hơi (Vapor Chamber) cải tiến.</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h3 style="color: var(--primary);">2. MSI Raider GE78 HX</h3>
      <p><b>Thông số:</b> RTX 5090 (175W), i9-16900HX, Màn hình 4K 144Hz.</p>
      <p>Nếu bạn cần sức mạnh tuyệt đối để thay thế máy bàn, đây là lựa chọn số 1. Dải đèn LED Matrix đặc trưng giờ đây đã có thêm nhiều hiệu ứng đồng bộ theo âm thanh game.</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h3 style="color: var(--primary);">3. Razer Blade 14</h3>
      <p><b>Thông số:</b> RTX 5060, Ryzen 9 9000 Series, Màn OLED 240Hz.</p>
      <p>Định nghĩa của "Nhỏ nhưng có võ". Razer Blade 14 vẫn là chiếc laptop gaming 14 inch mạnh nhất thế giới với bộ khung nhôm nguyên khối bền bỉ.</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h3 style="color: var(--primary);">4. Acer Predator Helios Neo 16</h3>
      <p><b>Thông số:</b> RTX 5050 Ti, i7-15700HX, RAM 16GB.</p>
      <p>Đây là "ông vua" phân khúc tầm trung. Với mức giá dễ tiếp cận nhưng hiệu năng lại vượt xa mong đợi, phù hợp cho học sinh, sinh viên chiến game AAA.</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h3 style="color: var(--primary);">5. Lenovo Legion Slim 5</h3>
      <p><b>Thông số:</b> RTX 5060, Ryzen 7, Màn hình 165Hz 100% sRGB.</p>
      <p>Sự cân bằng hoàn hảo giữa làm việc và giải trí. Bàn phím Legion TrueStrike vẫn đem lại cảm giác gõ tốt nhất trong phân khúc laptop gaming hiện nay.</p>
    </div>

    <p style="border-top: 1px dashed #444; padding-top: 15px; font-style: italic;">
      Tất cả các sản phẩm trên đều đang sẵn hàng tại <b>ForsakenShop</b> với ưu đãi tặng kèm Balo và Chuột Gaming cao cấp!
    </p>
  `,
    date: "27/02/2026"
  },
  {
    id: "n2",
    title: "Mẹo tối ưu RAM cho máy 4GB",
    summary: "Làm thế nào để Windows chỉ tốn 2.5GB RAM thay vì 3.2GB? Xem ngay...",
    content: "Các bước tắt OneDrive, SysMain và Windows Search...",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500",
    content: `
    <p>Sở hữu một chiếc máy tính có RAM 4GB (thực dùng khoảng 3.2GB - 3.4GB) là một thử thách lớn khi chạy các ứng dụng hiện đại. Dưới đây là các bước tối ưu hóa chuyên sâu mà ForsakenShop đã áp dụng thành công:</p>
    
    <h3 style="color: var(--primary); margin: 20px 0 10px;">1. Tắt các dịch vụ "hút" RAM ngầm</h3>
    <p>Windows có những dịch vụ chạy ngầm đôi khi không cần thiết đối với người dùng phổ thông:</p>
    <ul>
      <li><b>SysMain (Superfetch):</b> Dịch vụ này giúp tải trước ứng dụng nhưng lại chiếm dụng RAM và làm ổ cứng luôn ở mức 100%. Hãy vào <i>Services.msc</i>, tìm SysMain và chuyển sang <b>Disabled</b>.</li>
      <li><b>Connected User Experiences and Telemetry:</b> Đây là dịch vụ thu thập dữ liệu gửi về Microsoft. Tắt nó đi sẽ giúp máy nhẹ hơn rõ rệt.</li>
    </ul>

    <h3 style="color: var(--primary); margin: 20px 0 10px;">2. Dọn dẹp Task Manager</h3>
    <p>Hãy nhấn <b>Ctrl + Shift + Esc</b> và chuyển sang tab <i>Startup</i>. Vô hiệu hóa (Disable) tất cả các ứng dụng không cần thiết khi khởi động máy như:</p>
    <ul>
      <li>Microsoft Teams / OneDrive.</li>
      <li>Cortana và Windows Search (nếu bạn ít dùng thanh tìm kiếm).</li>
      <li>Các phần mềm hỗ trợ từ hãng máy tính.</li>
    </ul>

    <h3 style="color: var(--primary); margin: 20px 0 10px;">3. Tối ưu hóa trình duyệt Web</h3>
    <p>Trình duyệt là "kẻ sát nhân" RAM số 1. Hãy sử dụng các extension như <b>The Great Suspender</b> để tạm dừng các tab không dùng đến. Ngoài ra, hãy ưu tiên dùng Microsoft Edge vì nó có tính năng <i>Sleeping Tabs</i> rất tốt cho máy RAM yếu.</p>

    <div style="background: #222; padding: 15px; border-left: 5px solid var(--primary); margin-top: 20px;">
      <i><b>Lời khuyên từ Admin:</b> Nếu có điều kiện, việc nâng cấp thêm 1 thanh RAM 4GB nữa (lên tổng 8GB) sẽ là giải pháp triệt để nhất để trải nghiệm đa nhiệm mượt mà!</i>
    </div>
  `,
    date: "25/02/2026"
  }
];

// 2. Hàm render Tin tức ra trang news.html
function renderNews() {
  const newsGrid = document.getElementById("newsGrid");
  if (!newsGrid) return; // Nếu không phải trang news thì thoát

  newsGrid.innerHTML = "";
  newsList.forEach(item => {
    newsGrid.innerHTML += `
      <article class="product">
        <div class="product-img">
          <img src="${item.img}" style="object-fit: cover; height: 180px;">
          <div class="img-overlay" onclick="viewNewsDetail('${item.id}')">Đọc thêm</div>
        </div>
        <h3 style="margin-top: 10px;">${item.title}</h3>
        <p style="color: var(--muted); font-size: 13px; font-weight: normal;">${item.summary}</p>
        <span style="font-size: 11px; color: var(--primary);">${item.date}</span>
        <button onclick="viewNewsDetail('${item.id}')" style="margin-top:10px;">Xem chi tiết</button>
      </article>
    `;
  });
}

// 3. Hàm xử lý khi bấm xem chi tiết (có thể dùng alert hoặc lưu vào localStorage)
function viewNewsDetail(id) {
  const item = newsList.find(n => n.id === id);
  if (item) {
    // Để đơn giản và nhẹ RAM, ta dùng alert hoặc hiển thị vào 1 cái Modal giống Profile
    alert("Đang mở bài viết: " + item.title + "\n(Tính năng này bạn có thể làm trang news-detail.html tương tự product-detail)");
  }
}

// 4. Cập nhật hàm chạy khi load trang
document.addEventListener("DOMContentLoaded", () => {
  // ... các code cũ của bạn ...
  if (document.getElementById("newsGrid")) {
    renderNews();
  }
});
// 1. Hàm này chạy khi bấm nút ở trang news.html
function viewNewsDetail(id) {
  const item = newsList.find(n => n.id === id);
  if (item) {
    localStorage.setItem("currentNews", JSON.stringify(item)); // Lưu bài báo vào bộ nhớ
    window.location.href = "news-detail.html"; // Chuyển trang
  }
}

// 2. Hàm này chạy khi trang news-detail.html vừa load xong
function initNewsDetail() {
  const titleEl = document.getElementById("newsTitle");
  if (!titleEl) return; // Nếu không phải trang detail thì dừng

  const news = JSON.parse(localStorage.getItem("currentNews"));
  if (!news) return;

  // Đổ dữ liệu vào HTML
  titleEl.innerText = news.title;
  document.getElementById("newsDate").innerText = "Ngày đăng: " + news.date;
  document.getElementById("newsImg").src = news.img;
  
  // news.content có thể chứa HTML nếu bạn muốn bài viết có định dạng
  document.getElementById("newsContent").innerHTML = news.content;
}

// 3. Cập nhật DOMContentLoaded để gọi hàm initNewsDetail
document.addEventListener("DOMContentLoaded", () => {
    // ... các code cũ của bạn ...
    
    if (document.getElementById("newsGrid")) renderNews();
    
    if (document.getElementById("newsTitle")) initNewsDetail(); // Thêm dòng này
});