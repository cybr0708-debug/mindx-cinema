
window.onload = () => {
  document.getElementById("regUser").value = "";
  document.getElementById("regPass").value = "";
  document.getElementById("regPass2").value = "";
};

function register() {
  const user = document.getElementById("regUser").value.trim();
  const pass = document.getElementById("regPass").value;
  const pass2 = document.getElementById("regPass2").value;
  const msg = document.getElementById("msg");

  msg.style.color = "red";
  msg.innerText = "";

  if (!user || !pass || !pass2) {
    msg.innerText = "Không được để trống!";
    return;
  }

  if (pass !== pass2) {
    msg.innerText = "Mật khẩu nhập lại không khớp!";
    return;
  }


  let users = JSON.parse(localStorage.getItem("users")) || [];

  const isExist = users.some(u => u.username === user);
  if (isExist) {
    msg.innerText = "Tên đăng nhập đã tồn tại!";
    return;
  }

  users.push({
    username: user,
    password: pass
  });

  localStorage.setItem("users", JSON.stringify(users));

  msg.style.color = "#4caf50";
  msg.innerText = "Đăng ký thành công! Đang chuyển trang...";

  clearRegister();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

function clearRegister() {
  document.getElementById("regUser").value = "";
  document.getElementById("regPass").value = "";
  document.getElementById("regPass2").value = "";
}
