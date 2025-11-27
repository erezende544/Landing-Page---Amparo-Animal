const CURRENT_USER_ID = localStorage.getItem("LOGGED_USER_ID");

const currentPage = window.location.pathname.split("/").pop();
const privatePages = ["apadrinhamento.html"];
const isProtectedPage = privatePages.includes(currentPage);

if (isProtectedPage && !CURRENT_USER_ID) {
  alert("Você precisa fazer login para acessar esta página.");
  window.location.href = "../login.html";
}

function handleLogout() {
  localStorage.removeItem("LOGGED_USER_ID");
  localStorage.removeItem("LOGGED_USER_NAME");
  localStorage.removeItem("LOGGED_USER_EMAIL");
  window.location.reload();
}
