async function loadUserProfile() {
  if (!CURRENT_USER_ID) return; // CURRENT_USER_ID vem do auth.js

  try {
    const response = await fetch(`${API_URL}/usuarios/${CURRENT_USER_ID}`);
    if (!response.ok) throw new Error("Usuário não encontrado");
    const user = await response.json();

    document.getElementById("user-name-placeholder").textContent = user.nome;
    document.getElementById("user-email-placeholder").textContent = user.email;
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    document.getElementById("user-name-placeholder").textContent =
      "Erro ao carregar perfil";
  }
}

async function loadSponsoredAnimals() {
  if (!CURRENT_USER_ID) return;

  const container = document.getElementById("apadrinhados-container");
  container.innerHTML = "<p>Buscando seus afilhados...</p>";

  try {
    // 1. Busca os registros de apadrinhamento do usuário
    const sponsorResponse = await fetch(
      `${API_URL}/apadrinhamentos?usuarioId=${CURRENT_USER_ID}&status=ATIVO`
    );
    if (!sponsorResponse.ok) throw new Error("Erro ao buscar apadrinhamentos.");
    const sponsorships = await sponsorResponse.json();

    if (sponsorships.length === 0) {
      container.innerHTML =
        "<div class><p>Você ainda não possui afilhados.</p></div>";
      return;
    }

    // 2. Cria um array de promessas para buscar os detalhes de cada animal
    const animalPromises = sponsorships.map((s) =>
      fetch(`${API_URL}/animais/${s.animalId}`).then((res) => res.json())
    );

    // 3. Espera todas as buscas de animais terminarem
    const animals = await Promise.all(animalPromises);

    // 4. Limpa o container e renderiza os cards
    container.innerHTML = "";
    animals.forEach((animal) => {
      const card = document.createElement("div");
      card.className = "card animal-card";
      card.innerHTML = `
        <img src="${animal.foto}" class="card-img-top" alt="${animal.nome}">
        <div class="card-body">
          <h5 class="card-title">${animal.nome}</h5>
          <p class="card-text text-muted-foreground small">${animal.raca}</p>
          <a href="/apadrinhamento.html?id=${animal.id}" class="btn btn-sm btn-prim mt-2 d-flex justify-content-center">Visualizar</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar animais apadrinhados:", error);
    container.innerHTML = "<p>Erro ao carregar seus afilhados.</p>";
  }
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", async () => {
  if (!CURRENT_USER_ID) {
    return;
  }
  await loadUserProfile();
  await loadSponsoredAnimals();
});
