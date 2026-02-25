// ================== PRODUCT DETAIL ==================
document.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("currentProduct"));
const currentUser = localStorage.getItem("currentUser");
  const userBox = document.getElementById("username");
  if (userBox && currentUser) userBox.innerText = currentUser;
  if (!product) {
    alert("Không có dữ liệu sản phẩm!");
    history.back();
    return;
  }

  // Hiển thị dữ liệu
  document.getElementById("productName").innerText = product.name;
  document.getElementById("productImg").src = product.img;
  document.getElementById("productPrice").innerText =
    product.price.toLocaleString() + "đ";
  document.getElementById("productInfo").innerText =
    product.info || "Chưa có mô tả sản phẩm";

  // Thêm vào giỏ
  document.getElementById("addBtn").onclick = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(i => i.id === product.id);

    item ? item.qty++ : cart.push({ ...product, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ!");
  };
});