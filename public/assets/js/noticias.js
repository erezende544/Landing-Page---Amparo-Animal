document.addEventListener("DOMContentLoaded", () => {
  const url = "http://localhost:3001/noticias";

  const viewLista = document.getElementById("view-lista");
  const viewFormulario = document.getElementById("view-formulario");

  const listaDeNoticias = document.getElementById("lista-de-noticias");
  const botaoNovaNoticia = document.getElementById("botao-nova-noticia");

  const formularioDeNoticia = document.getElementById("formulario-de-noticia");
  const campoIdDaNoticia = document.getElementById("noticia-id");
  const tituloFormulario = document.getElementById("titulo-formulario");

  const campoTitulo = document.getElementById("titulo");
  const campoImagemUrl = document.getElementById("imagemUrl");
  const campoDescricaoCurta = document.getElementById("descricaoCurta");
  const campoNoticiaCompleta = document.getElementById("noticiaCompleta");
  const imagemPreview = document.getElementById("imagem-preview");

  const infoStatus = document.getElementById("info-status");
  const infoVisualizacoes = document.getElementById("info-visualizacoes");
  const infoDataCriacao = document.getElementById("info-data-criacao");

  const botaoSalvar = document.getElementById("botao-salvar");
  const botaoExcluirForm = document.getElementById("botao-excluir-form");
  const botaoNovoForm = document.getElementById("botao-novo-form");
  const botaoCancelar = document.getElementById("botao-cancelar");

  let noticias = [];

  // =============================================
  // SISTEMA DE PERMISSÕES
  // =============================================
  const Permissoes = {
    isAdmin() {
      const userId = localStorage.getItem("LOGGED_USER_ID");
      if (!userId) return false;
      const userEmail = localStorage.getItem("LOGGED_USER_EMAIL");
      return userEmail === "eduardo.machado@sga.pucminas.br";
    },

    aplicarPermissoes() {
      const isAdmin = this.isAdmin();
      const botaoNovaNoticia = document.getElementById("botao-nova-noticia");
      if (botaoNovaNoticia) {
        botaoNovaNoticia.style.display = isAdmin ? "flex" : "none";
      }
      console.log("Permissões aplicadas - Admin:", isAdmin);
      return isAdmin;
    },
  };

  // =============================================
  // SISTEMA DE VISUALIZAÇÕES
  // =============================================
  const incrementarVisualizacoes = async (noticiaId) => {
    try {
      const response = await fetch(`${url}/${noticiaId}`);
      if (!response.ok) throw new Error("Erro ao buscar notícia");

      const noticia = await response.json();
      const visualizacoesAtuais = parseInt(noticia.visualizacoes) || 0;
      const novasVisualizacoes = visualizacoesAtuais + 1;

      const updateResponse = await fetch(`${url}/${noticiaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          ...noticia,
          visualizacoes: novasVisualizacoes
        })
      });

      if (!updateResponse.ok) throw new Error("Erro ao atualizar visualizações");
      await buscarNoticias();
      return novasVisualizacoes;

    } catch (error) {
      console.error("Erro ao incrementar visualizações:", error);
      return null;
    }
  };

  const configurarControleVisualizacoes = () => {
    const inputVisualizacoes = document.getElementById("visualizacoes-input");
    const botaoAumentar = document.getElementById("botao-aumentar-visualizacoes");
    const botaoDiminuir = document.getElementById("botao-diminuir-visualizacoes");

    if (!inputVisualizacoes || !botaoAumentar || !botaoDiminuir) return;

    botaoAumentar.addEventListener("click", () => {
      const valorAtual = parseInt(inputVisualizacoes.value) || 0;
      inputVisualizacoes.value = valorAtual + 1;
      infoVisualizacoes.textContent = inputVisualizacoes.value;
    });

    botaoDiminuir.addEventListener("click", () => {
      const valorAtual = parseInt(inputVisualizacoes.value) || 0;
      if (valorAtual > 0) {
        inputVisualizacoes.value = valorAtual - 1;
        infoVisualizacoes.textContent = inputVisualizacoes.value;
      }
    });

    inputVisualizacoes.addEventListener("change", () => {
      const valor = parseInt(inputVisualizacoes.value) || 0;
      if (valor < 0) inputVisualizacoes.value = 0;
      infoVisualizacoes.textContent = inputVisualizacoes.value;
    });
  };

  const configurarContadorVisualizacoes = () => {
    listaDeNoticias.addEventListener("click", async (event) => {
      const botaoVer = event.target.closest(".botao-ver");
      if (botaoVer) {
        const id = botaoVer.dataset.id;
        await incrementarVisualizacoes(id);
        window.location.href = `ver-noticia.html?id=${id}`;
      }
    });
  };

  // Alterna entre lista e formulário
  const mostrarView = (view) => {
    if (view === "formulario") {
      viewLista.style.display = "none";
      viewFormulario.style.display = "block";
      window.scrollTo(0, 0);
    } else {
      viewFormulario.style.display = "none";
      viewLista.style.display = "block";
    }
  };

  // --- CRUD ---
  const buscarNoticias = async () => {
    console.log('🔍 Carregando notícias...');

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      noticias = await response.json();
      noticias = noticias.map(noticia => ({
        ...noticia,
        visualizacoes: noticia.visualizacoes || 0
      }));

      noticias.sort((a, b) => Number(a.id) - Number(b.id));
      apresentarNoticias();
      console.log(`✅ ${noticias.length} notícias carregadas`);

    } catch (error) {
      console.error('❌ ERRO:', error);
      listaDeNoticias.innerHTML = `
        <div class="alert alert-danger text-center">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Erro ao carregar notícias!
        </div>`;
    }
  };

  const enviarNoticia = async (noticia) => {
    try {
      const maiorId = noticias.reduce((max, n) => Math.max(max, Number(n.id)), 0);
      noticia.id = String(maiorId + 1);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(noticia),
      });

      if (!response.ok) throw new Error("Erro ao enviar notícia");
      await buscarNoticias();
      mostrarView("lista");
      limparFormulario();
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar notícia!");
    }
  };

  const atualizarNoticia = async (id, noticia) => {
    try {
      const response = await fetch(`${url}/${Number(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(noticia),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");
      await buscarNoticias();
      mostrarView("lista");
      limparFormulario();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar notícia!");
    }
  };

  const excluirNoticia = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Falha ao excluir notícia ${id}`);
      await buscarNoticias();
      limparFormulario();
      mostrarView("lista");
    } catch (error) {
      console.error("Erro ao excluir notícia:", error);
      alert("Erro ao excluir notícia!");
    }
  };

  // --- Renderização ---
  const apresentarNoticias = () => {
    console.log('🎨 INICIANDO RENDERIZAÇÃO...');
    console.time('RenderizacaoNoticias');

    listaDeNoticias.innerHTML = '';

    if (noticias.length === 0) {
      listaDeNoticias.innerHTML = '<p class="text-center text-muted">Nenhuma notícia cadastrada.</p>';
      console.log('📭 Nenhuma notícia para renderizar');
      console.timeEnd('RenderizacaoNoticias');
      return;
    }

    const isAdmin = Permissoes.isAdmin();
    console.log('👤 Permissões - Admin:', isAdmin);

    noticias.forEach((noticia) => {
      const cartao = document.createElement('div');
      cartao.className = 'cartao-noticia';
      const visualizacoes = noticia.visualizacoes || 0;

      const botoesAcao = isAdmin ? `
        <button type="button" class="botao-de-acao botao-editar" data-id="${noticia.id}">
          <i class="bi bi-pencil me-1"></i>Editar
        </button>
        <button type="button" class="botao-de-acao botao-excluir" data-id="${noticia.id}">
          <i class="bi bi-trash me-1"></i>Excluir
        </button>
      ` : '';

      cartao.innerHTML = `
        <img src="${noticia.imagemUrl}" alt="${noticia.titulo}" 
             loading="lazy"
             onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBlOWUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZkNGM0MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNlbSBJbWFnZW08L3RleHQ+PC9zdmc+'">
        <div class="cartao-noticia-conteudo">
          <h3>${noticia.titulo}</h3>
          <p>${noticia.descricaoCurta}</p>
          <div class="cartao-noticia-metadados">
            <span class="badge bg-secondary">
              <i class="bi bi-eye me-1"></i>${visualizacoes} visualizações
            </span>
          </div>
          <div class="cartao-noticia-acoes">
            <button type="button" class="botao-de-acao botao-ver" data-id="${noticia.id}">
              <i class="bi bi-eye me-1"></i>Ver Notícia
            </button>
            ${botoesAcao}
          </div>
        </div>`;
      listaDeNoticias.appendChild(cartao);
    });

    console.log(`✅ ${noticias.length} notícias renderizadas`);
    console.timeEnd('RenderizacaoNoticias');
  };

  // --- Formulário ---
  const limparFormulario = () => {
    formularioDeNoticia.reset();
    campoIdDaNoticia.value = "";
    tituloFormulario.textContent = "Adicionar Nova Notícia";
    botaoSalvar.textContent = "Salvar";
    botaoExcluirForm.style.display = "none";
    botaoNovoForm.style.display = "none";
    imagemPreview.src = "https://via.placeholder.com/300x200?text=Sem+Imagem";
    infoStatus.textContent = "--";

    const inputVisualizacoes = document.getElementById("visualizacoes-input");
    if (inputVisualizacoes) {
      inputVisualizacoes.value = "0";
    }
    infoVisualizacoes.textContent = "0";

    infoDataCriacao.textContent = "--";
  };

  const preencherFormularioParaEdicao = (noticia) => {
    campoIdDaNoticia.value = noticia.id;
    campoTitulo.value = noticia.titulo;
    campoImagemUrl.value = noticia.imagemUrl;
    campoDescricaoCurta.value = noticia.descricaoCurta;
    campoNoticiaCompleta.value = noticia.noticiaCompleta;
    imagemPreview.src = noticia.imagemUrl || "https://via.placeholder.com/300x200?text=Sem+Imagem";
    infoStatus.textContent = noticia.status || "--";

    const inputVisualizacoes = document.getElementById("visualizacoes-input");
    if (inputVisualizacoes) {
      inputVisualizacoes.value = noticia.visualizacoes || 0;
    }
    infoVisualizacoes.textContent = noticia.visualizacoes || "0";

    infoDataCriacao.textContent = noticia.dataCriacao || "--";
    tituloFormulario.textContent = `Editar Notícia (ID: ${noticia.id})`;
    botaoSalvar.textContent = "Salvar Alterações";
    botaoExcluirForm.style.display = "grid";
    botaoNovoForm.style.display = "grid";
    mostrarView("formulario");
  };

  // --- Eventos ---
  campoImagemUrl.addEventListener("input", () => {
    const urlImagem = campoImagemUrl.value;
    imagemPreview.src = urlImagem
      ? urlImagem
      : "https://via.placeholder.com/300x200?text=Sem+Imagem";
  });

  formularioDeNoticia.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = campoIdDaNoticia.value;
    const inputVisualizacoes = document.getElementById("visualizacoes-input");

    const noticia = {
      titulo: campoTitulo.value,
      imagemUrl: campoImagemUrl.value,
      descricaoCurta: campoDescricaoCurta.value,
      noticiaCompleta: campoNoticiaCompleta.value,
      status: infoStatus.textContent === "--" ? "Rascunho" : infoStatus.textContent,
      visualizacoes: inputVisualizacoes ? parseInt(inputVisualizacoes.value) || 0 : 0,
      dataCriacao: infoDataCriacao.textContent === "--"
        ? new Date().toLocaleDateString("pt-BR")
        : infoDataCriacao.textContent,
    };

    if (id) {
      await atualizarNoticia(Number(id), noticia);
    } else {
      await enviarNoticia(noticia);
    }
  });

  listaDeNoticias.addEventListener("click", async (event) => {
    const botaoVer = event.target.closest(".botao-ver");
    if (botaoVer) {
      const id = botaoVer.dataset.id;
      const noticia = noticias.find((n) => n.id === id);
      if (noticia) {
        window.location.href = `ver-noticia.html?id=${noticia.id}`;
      }
      return;
    }
    const botaoEditar = event.target.closest(".botao-editar");
    const botaoExcluir = event.target.closest(".botao-excluir");

    if (botaoEditar) {
      const id = Number(botaoEditar.dataset.id);
      const noticia = noticias.find((n) => Number(n.id) === id);
      if (noticia) preencherFormularioParaEdicao(noticia);
      return;
    }

    if (botaoExcluir) {
      const id = Number(botaoExcluir.dataset.id);
      if (confirm("Tem certeza que deseja excluir esta notícia?")) {
        await excluirNoticia(id);
        alert("Notícia excluída com sucesso!");
      }
      return;
    }
  });

  botaoNovaNoticia.addEventListener("click", () => {
    limparFormulario();
    mostrarView("formulario");
  });

  botaoCancelar.addEventListener("click", () => {
    limparFormulario();
    mostrarView("lista");
  });

  botaoExcluirForm.addEventListener("click", async () => {
    const idParaExcluir = Number(campoIdDaNoticia.value);
    if (idParaExcluir && confirm("Tem certeza que deseja EXCLUIR esta notícia PERMANENTEMENTE?")) {
      await excluirNoticia(idParaExcluir);
      alert("Notícia excluída com sucesso!");
    }
  });

  botaoNovoForm.addEventListener("click", () => {
    limparFormulario();
    mostrarView("formulario");
  });

  // Inicialização
  mostrarView("lista");
  buscarNoticias();
  Permissoes.aplicarPermissoes();
  configurarControleVisualizacoes();
  configurarContadorVisualizacoes();
});