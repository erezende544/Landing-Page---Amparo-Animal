async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(
      `${API_URL}/usuarios?email=${email}&senha=${password}`
    );
    if (!response.ok) throw new Error("Erro ao conectar com o servidor.");

    const users = await response.json();

    if (users.length > 0) {
      const user = users[0];
      localStorage.setItem("LOGGED_USER_ID", user.id);
      localStorage.setItem("LOGGED_USER_NAME", user.nome);
      localStorage.setItem("LOGGED_USER_EMAIL", user.email);
      window.location.href = "index.html";
    } else {
      alert("E-mail ou senha incorretos.");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Ocorreu um erro durante o login. Tente novamente.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});