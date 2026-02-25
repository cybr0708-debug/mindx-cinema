function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  const msg = document.getElementById("msg");

  msg.innerText = "";
  msg.style.color = "red";

  if (!user || !pass) {
    msg.innerText = "Không được để trống!";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.length === 0) {
    msg.innerText = "Chưa có tài khoản nào. Vui lòng đăng ký!";
    return;
  }

  const found = users.find(
    u => u.username === user && u.password === pass
  );

  if (!found) {
    msg.innerText = "Sai tài khoản hoặc mật khẩu!";
    return;
  }

  msg.style.color = "green";
  msg.innerText = "Đăng nhập thành công!";

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", found.username);

  setTimeout(() => {
    window.location.href = "home.html";
  }, 1000);
}

window.addEventListener("load", () => {
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
});