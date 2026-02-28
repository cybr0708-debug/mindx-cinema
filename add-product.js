const form = document.getElementById("addProductForm"); console.log(form);
const msg = document.getElementById("msg");
const products = JSON.parse(localStorage.getItem("products")) || [];
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const img = document.getElementById("image").value || "https://via.placeholder.com/300";
  if (!name || price <= 0) {
    msg.style.color = "#ff4d4d";
    msg.innerText = "Dữ liệu không hợp lệ!";
    return;
  }
const info = document.getElementById("info").value.trim();

const newProduct = {
  id: "p" + Date.now(),
  name,
  price,
  category,
  info,
  img,
};
  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));
  msg.style.color = "#4caf50";
  msg.innerText = "Thêm sản phẩm thành công!";
  form.reset();
  window.location.href = "home.html";
});
