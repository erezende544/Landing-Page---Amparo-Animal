// --- Variáveis Globais ---
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const animalId = urlParams.get("id");
const ANIMAL_ID_TO_SPONSOR = parseInt(animalId);

let ACTIVE_SPONSORSHIP_ID = null;

if (!ANIMAL_ID_TO_SPONSOR) {
  alert("Nenhum animal foi selecionado. Redirecionando para a página inicial.");
  window.location.href = "/index.html";
}

const svgPawIcon = `<svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 600 600" width="600" height="600">
<style>
  .s0 { fill: currentColor }
</style>
	<path id="Path 0" class="s0" d="m193.5 78.23c-3.85 1.04-9.03 2.99-11.5 4.33-2.47 1.34-7.35 5.25-10.83 8.69-4.75 4.68-7.44 8.51-10.72 15.25-2.4 4.95-5.1 11.7-5.99 15-0.89 3.3-2.23 10.05-2.98 15-0.79 5.25-1.22 14.21-1.03 21.5 0.2 7.43 1.17 16.56 2.39 22.5 1.14 5.5 3.38 13.6 4.98 18 1.6 4.4 3.93 10.03 5.18 12.5 1.24 2.47 4.29 7.65 6.76 11.5 2.48 3.85 6.81 9.65 9.62 12.9 2.82 3.24 7.82 7.8 11.12 10.12 3.3 2.33 8.7 5.49 12 7.01 3.47 1.61 9.17 3.18 13.5 3.72 4.78 0.6 9.49 0.59 13-0.03 3.03-0.54 8.19-2.27 11.49-3.85 3.63-1.74 8.57-5.43 12.54-9.37 4.14-4.1 7.89-9.08 10.17-13.5 1.98-3.85 4.58-10.15 5.78-14 1.2-3.85 2.81-11.05 3.58-16 0.77-4.95 1.39-14.18 1.37-20.5-0.02-6.32-0.63-14.88-1.35-19-0.72-4.13-2.43-11.55-3.81-16.5-1.37-4.95-3.58-11.7-4.91-15-1.34-3.3-4.66-9.83-7.39-14.5-3.42-5.85-7.93-11.46-14.47-18-6.81-6.81-11.34-10.41-16-12.73-3.57-1.77-9.65-3.89-13.5-4.7-3.85-0.8-8.12-1.64-9.5-1.85-1.37-0.21-5.65 0.47-9.5 1.51zm90 193.16c-4.4 0.73-11.82 2.32-16.5 3.54-4.68 1.21-12.55 3.9-17.5 5.96-4.95 2.06-12.15 5.58-16 7.81-3.85 2.24-11.5 7.42-17 11.51-5.5 4.1-14.95 12.62-21 18.93-6.05 6.32-14.44 16.41-18.65 22.42-4.2 6.02-9.92 15.21-12.72 20.44-2.79 5.23-6.7 13.32-8.68 18-1.99 4.67-5.17 13.67-7.06 20-1.9 6.32-4.11 15.55-4.92 20.5-0.8 4.95-1.46 13.95-1.45 20 0.01 6.85 0.72 14.39 1.89 20 1.03 4.95 3.26 12.37 4.95 16.5 1.69 4.12 4.95 10.42 7.24 14 2.3 3.57 6.93 9.21 10.29 12.53 3.36 3.32 8.81 7.64 12.11 9.6 3.3 1.96 9.6 4.72 14 6.14 4.4 1.41 9.8 3.1 12 3.75 2.2 0.65 6.03 0.97 8.5 0.72 2.47-0.25 7.2-1.23 10.5-2.16 3.3-0.94 8.68-3.14 11.95-4.89 5.08-2.73 7.12-4.79 14.09-14.19 4.49-6.05 10.13-12.99 12.56-15.41 2.42-2.43 7.78-6.93 11.92-10 4.13-3.08 11.11-7.27 15.5-9.32 4.39-2.05 11.8-4.7 16.48-5.88 6.56-1.66 10.33-2.03 16.5-1.64 5.39 0.35 10.12 1.38 14.5 3.16 3.57 1.46 8.75 4.15 11.5 5.99 2.75 1.84 7.66 5.99 10.91 9.22 3.26 3.23 8.47 9.25 11.6 13.38 3.17 4.19 8.06 9.16 11.08 11.26 2.98 2.06 8.34 4.66 11.91 5.76 3.57 1.11 7.85 2.23 9.5 2.49 1.65 0.27 5.93 0.65 9.5 0.85 3.57 0.2 9.65-0.04 13.5-0.54 3.85-0.49 9.7-1.77 13-2.84 3.3-1.07 8.7-3.56 12-5.52 3.3-1.97 7.94-5.47 10.31-7.77 2.37-2.3 5.94-6.67 7.94-9.69 2-3.02 4.43-8.2 5.41-11.5 0.98-3.3 2.07-8.93 2.42-12.5 0.34-3.58 0.14-10.55-0.45-15.5-0.6-4.95-2.24-13.5-3.64-19-1.41-5.5-3.94-14.27-5.63-19.5-1.69-5.23-4.41-12.88-6.05-17-1.64-4.13-5.75-12.9-9.12-19.5-3.37-6.6-8.66-15.83-11.74-20.5-3.09-4.68-7.83-11.25-10.53-14.61-2.71-3.36-7.62-9.02-10.92-12.58-3.3-3.56-9.15-9.27-13-12.69-3.85-3.42-10.82-8.84-15.5-12.04-4.68-3.2-12.32-7.81-17-10.24-4.68-2.44-11.43-5.63-15-7.1-3.57-1.48-10.1-3.79-14.5-5.15-4.4-1.36-12.05-3.21-17-4.1-4.95-0.9-15.07-1.81-22.5-2.03-8.4-0.24-16.52 0.11-21.5 0.93zm91-191.06c-2.2 0.72-6.48 2.56-9.5 4.08-3.02 1.52-7.52 4.25-10 6.06-2.48 1.81-6.98 5.93-10 9.17-3.02 3.23-8.03 9.7-11.11 14.37-3.09 4.67-6.86 10.96-8.39 13.99-1.53 3.02-4.25 9.55-6.05 14.5-1.79 4.95-4.26 14.17-5.48 20.5-1.9 9.88-2.14 13.68-1.7 27 0.38 11.17 1.11 17.74 2.63 23.5 1.15 4.4 3.75 11.37 5.77 15.5 2.53 5.19 5.69 9.53 10.25 14.07 3.75 3.75 8.95 7.72 12.08 9.24 3.02 1.46 7.86 3.12 10.75 3.68 2.89 0.55 7.61 0.74 10.5 0.41 2.89-0.33 7.95-1.46 11.25-2.5 3.3-1.05 8.93-3.66 12.5-5.81 3.57-2.15 9.58-6.99 13.34-10.75 3.77-3.76 8.78-9.54 11.15-12.84 2.36-3.3 6.12-9.38 8.35-13.5 2.24-4.13 5.25-10.65 6.69-14.5 1.45-3.85 3.68-11.28 4.97-16.5 1.29-5.23 2.67-12.43 3.06-16 0.4-3.58 0.69-11.45 0.64-17.5-0.05-6.88-0.81-14.37-2.03-20-1.08-4.95-3.18-11.93-4.68-15.5-1.5-3.58-4.2-8.75-6.01-11.5-1.81-2.75-5.47-7-8.14-9.45-2.66-2.45-7.77-5.81-11.34-7.47-5.56-2.58-7.87-3.06-16-3.29-5.86-0.16-11.03 0.24-13.5 1.04zm133 133.8c-2.75 0.44-7.93 1.95-11.5 3.36-3.57 1.41-9.65 4.43-13.5 6.7-4.18 2.46-10.88 8-16.62 13.72-5.29 5.27-11.77 12.96-14.4 17.09-2.63 4.12-6.11 10.42-7.73 14-1.62 3.57-4.03 10.77-5.36 16-1.79 7.01-2.41 12.12-2.38 19.5 0.02 7.77 0.54 11.45 2.31 16.5 1.26 3.57 3.68 8.52 5.38 11 1.71 2.47 4.38 5.69 5.95 7.16 1.57 1.46 4.42 3.53 6.35 4.61 1.93 1.08 5.98 2.7 9 3.61 3.04 0.9 8.86 1.63 13 1.61 4.13-0.01 10.2-0.74 13.5-1.61 3.3-0.86 8.7-2.81 12-4.32 3.3-1.5 9.6-5.46 14-8.79 4.4-3.33 10.5-8.69 13.56-11.91 3.06-3.22 7.83-9.24 10.59-13.36 2.76-4.13 6.39-10.43 8.07-14 1.67-3.58 3.97-9.65 5.1-13.5 1.13-3.85 2.52-10.38 3.09-14.5 0.57-4.13 0.79-9.98 0.5-13-0.3-3.03-1.01-7.3-1.58-9.5-0.58-2.2-2.35-6.59-3.94-9.75-1.59-3.16-4.58-7.44-6.64-9.51-2.06-2.08-5.77-4.91-8.25-6.3-2.48-1.39-6.52-3.09-9-3.78-2.48-0.69-7.2-1.38-10.5-1.54-3.3-0.16-8.25 0.07-11 0.51zm-430.25 13.44c-2.89 0.78-6.71 2.16-8.5 3.06-1.79 0.9-5.46 3.26-8.16 5.25-2.7 1.99-6.85 6.32-9.21 9.62-2.57 3.58-5.44 9.42-7.13 14.5-2.08 6.27-2.9 10.86-3.1 17.5-0.18 5.57 0.34 12.05 1.37 17 0.91 4.4 2.95 11.37 4.54 15.5 1.59 4.12 5.13 10.87 7.88 15 2.75 4.12 6.92 9.54 9.28 12.03 2.35 2.5 6.75 6.62 9.78 9.16 3.03 2.55 9.1 6.43 13.5 8.62 4.4 2.2 10.7 4.71 14 5.58 3.3 0.86 9.83 1.57 14.5 1.57 4.68-0.01 10.53-0.48 13-1.05 2.47-0.57 7.37-2.47 10.87-4.22 3.85-1.92 8.44-5.37 11.57-8.69 2.86-3.03 6.51-7.75 8.11-10.5 1.6-2.75 3.74-7.48 4.75-10.5 1.01-3.03 2.11-9.78 2.43-15 0.35-5.77 0.11-12.05-0.63-16-0.66-3.58-1.92-8.75-2.78-11.5-0.87-2.75-3.32-8.6-5.45-13-2.13-4.4-6.7-11.6-10.15-16-3.45-4.4-9.64-10.68-13.75-13.96-4.11-3.27-11.07-7.61-15.47-9.64-4.4-2.03-10.36-4.19-13.25-4.79-2.89-0.61-9.19-1.08-14-1.04-4.81 0.03-11.11 0.71-14 1.5z"/>
</svg>`;

// --- Funções de Carregamento ---

async function loadAnimalInfo() {
  try {
    const response = await fetch(`${API_URL}/animais/${ANIMAL_ID_TO_SPONSOR}`);
    if (!response.ok) throw new Error("Animal não encontrado");
    const animal = await response.json();

    document.getElementById(
      "subtitulo-apadrinhamento"
    ).textContent = `Você está apadrinhando a ${animal.nome}`;
    document.getElementById("animal-nome").textContent = animal.nome;
    document.getElementById(
      "animal-detalhes"
    ).textContent = `${animal.idade} • ${animal.raca}`;
    document.getElementById("animal-descricao").textContent = animal.descricao;
    const imgElement = document.getElementById("animal-foto");
    imgElement.src = animal.foto;
    imgElement.alt = `Foto de ${animal.nome}`;
  } catch (error) {
    console.error("Erro ao carregar informações do animal:", error);
    document.getElementById("animal-nome").textContent =
      "Erro ao carregar animal";
  }
}

async function loadPlanos() {
  try {
    const response = await fetch(`${API_URL}/planos`);
    if (!response.ok) throw new Error("Planos não encontrados");
    const planos = await response.json();

    const container = document.getElementById("planos-container");
    container.innerHTML = "";

    planos.forEach((plano) => {
      let vantagensHTML = "";
      if (plano.vantagens && plano.vantagens.length > 0) {
        vantagensHTML = `
        <ul class="list-unstyled">
            ${plano.vantagens
              .map(
                (vantagem) => `
              <li class="d-flex align-items-start mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 600 600" class="paw-svg me-2">
                </svg>
                <span class="text-muted-foreground small">${vantagem}</span>
              </li>
            `
              )
              .join("")}
          </ul>
        `;
      }

      const cardDiv = document.createElement("div");
      cardDiv.className = "card plan-card h-100 flex-plan-item"; // <- Usando a nova classe
      cardDiv.dataset.planoId = plano.id;

      cardDiv.innerHTML = `
          <div class="card-body d-flex flex-column p-4">
            <div >
              <h5 class="card-title fw-semibold">${plano.nome}</h5>
              <p id="description" class="text-muted-foreground small">${
                plano.descricao
              }</p>
              <span class="fs-2 fw-bold  d-block">R$${plano.valor
                .toFixed(2)
                .replace(".", ",")}</span>
              <p class="text-muted-foreground small" style="opacity: 0.7;">cobrados mensalmente</p>
            </div>
            <hr class="" style="border-color: var(--border);">
            ${vantagensHTML}
            <div class="mt-auto"> 
              <button class="btn btn-escolher w-100">Escolher</button>
            </div>
          </div>
      `;
      container.appendChild(cardDiv);
    });

    container.querySelectorAll(".plan-card").forEach((card) => {
      card.addEventListener("click", () => selectPlan(card));
    });
  } catch (error) {
    console.error("Erro ao carregar planos:", error);
  }
}

function formatarValidade(validadeStr) {
  if (typeof validadeStr !== "string") return "";
  if (validadeStr.includes("/")) {
    return validadeStr;
  }
  if (validadeStr.length === 4) {
    return `${validadeStr.slice(0, 2)}/${validadeStr.slice(2, 4)}`;
  }
  return validadeStr;
}

async function loadCartoesCadastrados() {
  try {
    const response = await fetch(
      `${API_URL}/cartoesCadastrados?usuarioId=${CURRENT_USER_ID}`
    );
    if (!response.ok) throw new Error("Cartões não encontrados");
    const cartoes = await response.json();

    const container = document.getElementById("lista-cartoes-cadastrados");
    container.innerHTML = "";

    if (cartoes.length === 0) {
      container.innerHTML =
        '<li class="list-group-item text-muted-foreground">Nenhum cartão cadastrado.</li>';
      return;
    }

    cartoes.forEach((cartao, index) => {
      const finalCartao = cartao.numeroCartao.slice(-4);
      const validadeFormatada = formatarValidade(cartao.validade);

      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
        <div class="d-flex align-items-center">
          <input class="form-check-input me-3" type="radio" name="cartao-selecionado" id="cartao-${
            cartao.id
          }" value="${cartao.id}" ${index === 0 ? "checked" : ""}>
          <label class="form-check-label d-flex align-items-center" for="cartao-${
            cartao.id
          }">
            <i class="bi bi-credit-card-fill fs-4 me-3 text-muted-foreground" style="opacity: 0.7;"></i>
            <div>
              <div class="fw-bold">**** **** **** ${finalCartao}</div>
              <div class="text-muted-foreground small" style="opacity: 0.7;">${
                cartao.alias || "Cartão Padrão"
              } • Expira em ${validadeFormatada}</div>
            </div>
          </label>
          <div class="dropdown ms-auto">
            <button class="btn-options" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-three-dots"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item btn-edit-card" href="#" data-id="${
                cartao.id
              }">Editar</a></li>
              <li><a class="dropdown-item btn-remove-card" href="#" data-id="${
                cartao.id
              }">Remover</a></li>
            </ul>
          </div>
          </div>
      `;
      container.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar cartões:", error);
  }
}

function selectPlan(selectedCard) {
  document.querySelectorAll(".plan-card").forEach((card) => {
    card.classList.remove("selected");
    card.querySelector(".btn-escolher").textContent = "Escolher";
  });

  selectedCard.classList.add("selected");
  selectedCard.querySelector(".btn-escolher").textContent = "Selecionado";
}

function handleOpenAddModal() {
  const modalElement = document.getElementById("modalAdicionarCartao");
  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  document.getElementById("modalAdicionarCartaoLabel").textContent =
    "Adicionar novo cartão";
  document.getElementById("form-novo-cartao").reset();
  document.getElementById("cartao-edit-id").value = ""; // Limpa o ID de edição

  modal.show();
}

async function handleOpenEditModal(cardId) {
  try {
    // 1. Buscar os dados do cartão específico
    const response = await fetch(`${API_URL}/cartoesCadastrados/${cardId}`);
    if (!response.ok) throw new Error("Não foi possível carregar o cartão.");
    const cartao = await response.json();

    const modalElement = document.getElementById("modalAdicionarCartao");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    // 2. Preencher o formulário
    document.getElementById("modalAdicionarCartaoLabel").textContent =
      "Editar Cartão";
    document.getElementById("cartao-edit-id").value = cartao.id;
    document.getElementById("cartao-numero").value = cartao.numeroCartao;
    document.getElementById("cartao-nome").value = cartao.nomeTitular;
    document.getElementById("cartao-validade").value = formatarValidade(
      cartao.validade
    );
    document.getElementById("cartao-cvv").value = cartao.cvv;
    document.getElementById("cartao-alias").value = cartao.alias;

    // 3. Aplicar máscaras aos valores preenchidos
    maskCardNumber({ target: document.getElementById("cartao-numero") });
    maskValidity({ target: document.getElementById("cartao-validade") });

    // 4. Abrir a modal
    modal.show();
  } catch (error) {
    console.error("Erro ao preparar edição:", error);
    alert(error.message);
  }
}

async function handleRemoveCard(cardId) {
  if (!window.confirm("Tem certeza que deseja remover este cartão?")) {
    return;
  }

  try {
    await fetch(`${API_URL}/cartoesCadastrados/${cardId}`, {
      method: "DELETE",
    });
    // Recarrega a lista de cartões para refletir a remoção
    loadCartoesCadastrados();
  } catch (error) {
    console.error("Erro ao remover cartão:", error);
    alert("Não foi possível remover o cartão.");
  }
}

async function handleNovoCartaoSubmit(event) {
  event.preventDefault();

  const editId = document.getElementById("cartao-edit-id").value;
  const isEditMode = Boolean(editId);

  const numero = document.getElementById("cartao-numero").value;
  const nome = document.getElementById("cartao-nome").value;
  const validade = document.getElementById("cartao-validade").value;
  const cvv = document.getElementById("cartao-cvv").value;
  let alias = document.getElementById("cartao-alias").value;

  if (!alias) {
    alias = `Cartão final ${numero.slice(-4)}`;
  }

  const novoCartao = {
    usuarioId: CURRENT_USER_ID,
    alias: alias,
    numeroCartao: numero.replace(/\s/g, ""), // Salva sem espaços
    nomeTitular: nome,
    validade: validade,
    cvv: cvv,
  };

  const method = isEditMode ? "PUT" : "POST";
  const url = isEditMode
    ? `${API_URL}/cartoesCadastrados/${editId}`
    : `${API_URL}/cartoesCadastrados`;

  try {
    await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoCartao),
    });

    loadCartoesCadastrados();

    const modalElement = document.getElementById("modalAdicionarCartao");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    event.target.reset();
    document.getElementById("cartao-edit-id").value = ""; // Limpa o ID
  } catch (error) {
    console.error("Erro ao salvar novo cartão:", error);
    alert("Não foi possível salvar o cartão. Tente novamente.");
  }
}

async function handleFinalizarApadrinhamento() {
  const planoSelecionado = document.querySelector(".plan-card.selected");
  if (!planoSelecionado) {
    alert("Por favor, escolha um plano para continuar.");
    return;
  }
  const planoId = parseInt(planoSelecionado.dataset.planoId);

  const cartaoSelecionado = document.querySelector(
    'input[name="cartao-selecionado"]:checked'
  );
  if (!cartaoSelecionado) {
    alert("Por favor, selecione ou cadastre um método de pagamento.");
    return;
  }
  const cartaoId = parseInt(cartaoSelecionado.value);

  const novoApadrinhamento = {
    usuarioId: CURRENT_USER_ID,
    animalId: ANIMAL_ID_TO_SPONSOR,
    planoId: planoId,
    cartoesCadastradoId: cartaoId,
    dataInicio: new Date().toISOString().split("T")[0],
    status: "ATIVO",
  };

  try {
    await fetch(`${API_URL}/apadrinhamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoApadrinhamento),
    });

    alert("Apadrinhamento realizado com sucesso! Obrigado pelo seu apoio.");
    // Recarrega a página para que checkExistingSponsorship mude o botão
    window.location.reload();
  } catch (error) {
    console.error("Erro ao criar apadrinhamento:", error);
    alert("Não foi possível finalizar o apadrinhamento. Tente novamente.");
  }
}

async function handleCancelSponsorship() {
  if (!ACTIVE_SPONSORSHIP_ID) {
    alert("Erro: ID do apadrinhamento não encontrado.");
    return;
  }

  if (
    !window.confirm(
      "Tem certeza que deseja cancelar seu apadrinhamento para este animal?"
    )
  ) {
    return;
  }

  try {
    // Usamos PATCH para atualizar apenas o status
    await fetch(`${API_URL}/apadrinhamentos/${ACTIVE_SPONSORSHIP_ID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELADO" }),
    });

    alert("Apadrinhamento cancelado com sucesso.");
    window.location.reload(); // Recarrega a página para resetar o estado
  } catch (error) {
    console.error("Erro ao cancelar apadrinhamento:", error);
    alert("Não foi possível cancelar o apadrinhamento.");
  }
}

async function checkExistingSponsorship() {
  try {
    const response = await fetch(
      `${API_URL}/apadrinhamentos?usuarioId=${CURRENT_USER_ID}&animalId=${ANIMAL_ID_TO_SPONSOR}&status=ATIVO`
    );
    if (!response.ok)
      throw new Error("Erro ao checar apadrinhamento existente.");

    const existingSponsorships = await response.json();
    const btnFinalizar = document.getElementById(
      "btn-finalizar-apadrinhamento"
    );

    if (existingSponsorships.length > 0) {
      const sponsorship = existingSponsorships[0];
      ACTIVE_SPONSORSHIP_ID = sponsorship.id;

      btnFinalizar.textContent = "Cancelar Apadrinhamento";
      btnFinalizar.classList.remove("btn-primary");
      btnFinalizar.classList.add("btn-danger"); // (Use .btn-danger do Bootstrap)
      btnFinalizar.addEventListener("click", handleCancelSponsorship);

      const existingPlanId = sponsorship.planoId;
      const existingPlanCard = document.querySelector(
        `.plan-card[data-plano-id="${existingPlanId}"]`
      );
      if (existingPlanCard) {
        selectPlan(existingPlanCard);
      }

      const existingCardId = sponsorship.cartoesCadastradoId;
      const existingCardRadio = document.getElementById(
        `cartao-${existingCardId}`
      );
      if (existingCardRadio) {
        existingCardRadio.checked = true;
      }

      document
        .querySelectorAll(".plan-card")
        .forEach((card) => (card.style.pointerEvents = "none"));
      document
        .querySelectorAll("#lista-cartoes-cadastrados input")
        .forEach((input) => (input.disabled = true));
      document.getElementById("btn-novo-cartao").disabled = true;
    } else {
      btnFinalizar.textContent = "Apadrinhar";
      btnFinalizar.classList.remove("btn-danger");
      btnFinalizar.classList.add("btn-primary");
      btnFinalizar.addEventListener("click", handleFinalizarApadrinhamento);
    }
  } catch (error) {
    console.error(error.message);
  }
}

// --- Funções de Máscara ---

function maskCardNumber(event) {
  let value = event.target.value;
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{4})/g, "$1 ");
  value = value.trim();
  event.target.value = value;
}
function maskValidity(event) {
  let value = event.target.value;
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  event.target.value = value;
}
function maskCVV(event) {
  let value = event.target.value;
  value = value.replace(/\D/g, "");
  event.target.value = value;
}

// --- Inicialização ---

document.addEventListener("DOMContentLoaded", async () => {
  // --- Carregamento Inicial ---
  await loadAnimalInfo();
  await loadPlanos();
  await loadCartoesCadastrados();

  // Esta função agora define o listener correto do botão principal
  await checkExistingSponsorship();

  // --- Ativadores dos eventos ---
  document
    .getElementById("form-novo-cartao")
    .addEventListener("submit", handleNovoCartaoSubmit);

  // O listener de 'btn-finalizar-apadrinhamento' é definido em checkExistingSponsorship

  // --- Máscaras de Input ---
  document
    .getElementById("cartao-numero")
    .addEventListener("input", maskCardNumber);
  document
    .getElementById("cartao-validade")
    .addEventListener("input", maskValidity);
  document.getElementById("cartao-cvv").addEventListener("input", maskCVV);

  // --- Abrir Modal de 'Novo Cartão' ---
  document
    .getElementById("btn-novo-cartao")
    .addEventListener("click", handleOpenAddModal);

  // --- editar/remover cartões ---
  document
    .getElementById("lista-cartoes-cadastrados")
    .addEventListener("click", (event) => {
      const editBtn = event.target.closest(".btn-edit-card");
      if (editBtn) {
        event.preventDefault();
        handleOpenEditModal(editBtn.dataset.id);
      }
      const removeBtn = event.target.closest(".btn-remove-card");
      if (removeBtn) {
        event.preventDefault();
        handleRemoveCard(removeBtn.dataset.id);
      }
    });
});
