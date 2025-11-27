/**
 * Carrega o header dinâmico em todas as páginas.
 * Este script deve ser carregado DEPOIS de 'auth.js'
 */
function loadHeader() {
  // 1. Pega os dados da "sessão" do localStorage
  const userName = localStorage.getItem("LOGGED_USER_NAME");
  const userEmail = localStorage.getItem("LOGGED_USER_EMAIL"); // <-- NOVO
  const placeholder = document.getElementById("header-placeholder");

  if (!placeholder) {
    console.error("Erro: Placeholder do header não encontrado.");
    return;
  }

  let userMenuHTML = "";

  if (userName && userEmail) {
    // --- USUÁRIO ESTÁ LOGADO (Modern UI) ---
    // (Usa o nome e email salvos durante o login)
    userMenuHTML = `
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle d-flex align-items-center" 
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false" 
        >
         <span>Olá, <b>${userName}</b></span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          
          <li>
            <span class="dropdown-item-text">
              <strong class="d-block">${userName}</strong>
              <small class="text-muted-foreground">${userEmail}</small> 
            </span>
          </li>

          <li><hr class="dropdown-divider"></li>
          
          <li>
            <a class="dropdown-item" href="meu-perfil.html">Meu Perfi</a>
          </li>
          <li>
            <a class="dropdown-item dropdown-item-danger" href="#" id="logout-button">
            Sair
            </a>
          </li>
        </ul>
      </li>
    `;
  } else {
    // --- USUÁRIO ESTÁ DESLOGADO ---
    // (Botões de Login e Registrar)
    userMenuHTML = `
    <a class="btn me-2" href="login.html">Login</a>
    `;
  }

  // 2. Monta o HTML completo do header
  // (Ajuste os links de navegação conforme sua necessidade)
  const headerHTML = `
    <nav class="navbar navbar-expand-lg">
      <div
        class="max-width-1280 mx-auto d-flex align-items-center flex-grow-1 px-3 px-md-5 flex-wrap"
      >
        <a class="navbar-brand me-auto" href="index.html">Amparo Animal</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item"><a class="nav-link" href="noticia.html">Notícias</a></li>
            <li class="nav-item">
              <a class="nav-link" href="#">Doação de itens de Pet</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Postagens de adotantes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Administração de ONGs</a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            ${userMenuHTML}
          </ul>
        </div>
      </div>
    </nav>
  `;

  // 3. Injeta o HTML no placeholder
  placeholder.innerHTML = headerHTML;

  // 4. Adiciona o listener para o botão "Sair"
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

// Garante que o script rode após o HTML ser carregado
document.addEventListener("DOMContentLoaded", loadHeader);
