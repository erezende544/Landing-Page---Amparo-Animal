document.addEventListener("DOMContentLoaded", async () => {
  // const replit = "localhost:3001/"; // Altere para a URL correta do seu Replit
  // const url = replit + "empresas";
  const url = "const API_URL = 'http://localhost:3001/empresas';"
  const main = document.querySelector("main");

  // Fotos personalizadas por ID
  const imagens = {
    "1": "assets/images/MatilhaReal.png",
    "2": "assets/images/CaesAmigos.jpg",
    "3": "assets/images/Adimax.png",
    "4": "assets/images/CaoViver.png"
  };

  try {
    const response = await fetch(url);
    const data = await response.json();

    const empresas = data.empresas || data;

    main.innerHTML = "";

    empresas.forEach(emp => {
      const card = document.createElement("div");
      card.style.marginBottom = "20px";
      card.classList.add("empresa-card");

      card.innerHTML = `
        <div class="empresa-foto">
          <img src="${imagens[emp.id] || 'ong.png'}" alt="Foto da empresa" />
        </div>

        <div class="empresa-info">
          <h3 class="empresa-nome">${emp.nome_fantasia || emp.nomeFantasia || "Nome não informado"}</h3>
          <p><strong>Endereço:</strong> ${emp.endereco || "Não informado"}</p>
          <p><strong>Contato:</strong> ${emp.contato || "Não informado"}</p>
          <p><strong>E-mail:</strong> ${emp.email || "Não informado"}</p>
        </div>

        <div class="card-actions">
          <button class="btn btn-sm btn-primary btn-editar"
            onclick="window.location.href='map.html?id=${emp.id}'">
            <i class="bi bi-geo-alt"></i> Localização
          </button>
        </div>
      `;

      main.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar empresas do Replit:", error);
    main.innerHTML = `<p>Erro ao carregar empresas.</p>`;
  }
});
