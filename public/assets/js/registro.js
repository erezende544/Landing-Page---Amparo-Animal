async function handleRegister(event) {
  event.preventDefault();
  const isOng = document.getElementById("tipo-ong").checked;
  if (isOng) {
    await handleOngRegister();
  } else {
    await handleUserRegister();
  }
}

async function handleUserRegister() {
  const nome = document.getElementById("user-nome").value;
  const email = document.getElementById("user-email").value;
  const senha = document.getElementById("user-senha").value;
  const senhaConfirma = document.getElementById("user-senha-confirma").value;

  // 1. Validação de senha
  if (senha !== senhaConfirma) {
    alert("As senhas não coincidem.");
    return;
  }

  // 2. Verifica se o e-mail já existe
  try {
    const checkEmail = await fetch(`${API_URL}/usuarios?email=${email}`);
    const existingUser = await checkEmail.json();
    if (existingUser.length > 0) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    // 3. Cria o novo usuário
    const newUser = { nome, email, senha }; // Adicione outros campos se desejar
    await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    window.location.href = "login.html";
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    alert("Falha ao registrar. Tente novamente.");
  }
}

async function handleOngRegister() {
  const nome = document.getElementById("ong-nome").value;
  const cnpj = document.getElementById("ong-cnpj").value;
  const email = document.getElementById("ong-email").value;
  const senha = document.getElementById("ong-senha").value;

  // 1. Verifica se o e-mail ou CNPJ já existem
  try {
    const checkEmail = await fetch(`${API_URL}/empresas?email=${email}`);
    const existingEmail = await checkEmail.json();
    if (existingEmail.length > 0) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    const checkCnpj = await fetch(`${API_URL}/empresas?cnpj=${cnpj}`);
    const existingCnpj = await checkCnpj.json();
    if (existingCnpj.length > 0) {
      alert("Este CNPJ já está cadastrado.");
      return;
    }

    // 2. Cria a nova empresa (ONG)
    // Nota: O db.json usa "nome fantasia" e outros campos. Ajuste conforme necessário.
    const newOng = {
      "nome fantasia": nome,
      cnpj,
      email,
      senha,
    };

    await fetch(`${API_URL}/empresas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOng),
    });

    alert("ONG registrada com sucesso! Você será redirecionado para o login.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Erro ao registrar ONG:", error);
    alert("Falha ao registrar. Tente novamente.");
  }
}

function toggleFormFields(type) {
  const fieldsUsuario = document.getElementById("fields-usuario");
  const inputsUsuario = fieldsUsuario.querySelectorAll("input");
  const fieldsOng = document.getElementById("fields-ong");
  const inputsOng = fieldsOng.querySelectorAll("input");

  if (type === "ong") {
    fieldsUsuario.classList.add("d-none");
    inputsUsuario.forEach((input) => input.removeAttribute("required"));

    fieldsOng.classList.remove("d-none");
    inputsOng.forEach((input) => input.setAttribute("required", "required"));
  } else {
    fieldsUsuario.classList.remove("d-none");
    inputsUsuario.forEach((input) =>
      input.setAttribute("required", "required")
    );

    fieldsOng.classList.add("d-none");
    inputsOng.forEach((input) => input.removeAttribute("required"));
  }
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  const cnpjInput = document.getElementById("ong-cnpj");
  if (cnpjInput) {
    cnpjInput.addEventListener("input", maskCNPJ);
  }

  const radioUsuario = document.getElementById("tipo-usuario");
  const radioOng = document.getElementById("tipo-ong");

  if (radioUsuario) {
    radioUsuario.addEventListener("change", () => toggleFormFields("usuario"));
  }
  if (radioOng) {
    radioOng.addEventListener("change", () => toggleFormFields("ong"));
  }

  toggleFormFields("usuario");
});
