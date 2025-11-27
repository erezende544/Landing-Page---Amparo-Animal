document.addEventListener("DOMContentLoaded", () => {
  const url = "http://localhost:3001/noticias";
  //const url = "https://5969dde0-d758-4518-bb60-6711b431a1df-00-122a0m2a0fibs.janeway.replit.dev/noticias";

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

  // Buscar notícias


  // =============================================
  // SISTEMA DE PERMISSÕES
  // =============================================


  const Permissoes = {
    // Verificar se usuário atual é admin
    isAdmin() {
      const userId = localStorage.getItem("LOGGED_USER_ID");
      if (!userId) return false;

      // Em produção, você faria uma requisição para buscar o usuário
      // Por enquanto, vamos verificar por email (solução temporária)
      const userEmail = localStorage.getItem("LOGGED_USER_EMAIL");
      return userEmail === "eduardo.machado@sga.pucminas.br"; // Email do admin
    },

    // Mostrar/ocultar elementos baseado na permissão
    aplicarPermissoes() {
      const isAdmin = this.isAdmin();

      // Botão "Nova Notícia"
      const botaoNovaNoticia = document.getElementById("botao-nova-noticia");
      if (botaoNovaNoticia) {
        botaoNovaNoticia.style.display = isAdmin ? "flex" : "none";
      }

      // Botões de ação nos cards (serão tratados na renderização)
      console.log("Permissões aplicadas - Admin:", isAdmin);
      return isAdmin;
    },
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

  // Buscar notícias
  // Buscar notícias - VERSÃO SIMPLIFICADA
  // Buscar notícias - SEM LOADING
  const buscarNoticias = async () => {
    console.log('🔍 Carregando notícias...');

    try {
      // REMOVER a parte do loading spinner
      // listaDeNoticias.innerHTML = `<div class="text-center py-5">...</div>`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      noticias = await response.json();
      noticias.sort((a, b) => Number(a.id) - Number(b.id));
      apresentarNoticias();

      console.log(`✅ ${noticias.length} notícias carregadas`);

    } catch (error) {
      console.error('❌ ERRO:', error);
      listaDeNoticias.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Erro ao carregar notícias!
            </div>
        `;
    }
  };

  // Criar notícia (ID numérico)
  const enviarNoticia = async (noticia) => {
    try {
      const maiorId = noticias.reduce(
        (max, n) => Math.max(max, Number(n.id)),
        0
      );
      noticia.id = String(maiorId + 1); // força ID string

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

  // Atualizar notícia
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

  // Excluir notícia (corrigido)
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

    noticias.forEach((noticia, index) => {
      const cartao = document.createElement('div');
      cartao.className = 'cartao-noticia';

      // 🎯 BOTÕES CONDICIONAIS - só mostra editar/excluir se for admin
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
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBlOWUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZkNGM0MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNlbSBJbWFnZW08L3RleHQ+PC9zdmc+'">
            <div class="cartao-noticia-conteudo">
                <h3>${noticia.titulo}</h3>
                <p>${noticia.descricaoCurta}</p>
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
    infoVisualizacoes.textContent = "--";
    infoDataCriacao.textContent = "--";
  };

  const preencherFormularioParaEdicao = (noticia) => {
    campoIdDaNoticia.value = noticia.id;
    campoTitulo.value = noticia.titulo;
    campoImagemUrl.value = noticia.imagemUrl;
    campoDescricaoCurta.value = noticia.descricaoCurta;
    campoNoticiaCompleta.value = noticia.noticiaCompleta;
    imagemPreview.src =
      noticia.imagemUrl ||
      "https://via.placeholder.com/300x200?text=Sem+Imagem";
    infoStatus.textContent = noticia.status || "--";
    infoVisualizacoes.textContent = noticia.visualizacoes || "--";
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

    const noticia = {
      titulo: campoTitulo.value,
      imagemUrl: campoImagemUrl.value,
      descricaoCurta: campoDescricaoCurta.value,
      noticiaCompleta: campoNoticiaCompleta.value,
      status:
        infoStatus.textContent === "--" ? "Rascunho" : infoStatus.textContent,
      visualizacoes:
        infoVisualizacoes.textContent === "--"
          ? "0"
          : infoVisualizacoes.textContent,
      dataCriacao:
        infoDataCriacao.textContent === "--"
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
    if (
      idParaExcluir &&
      confirm("Tem certeza que deseja EXCLUIR esta notícia PERMANENTEMENTE?")
    ) {
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
  Permissoes.aplicarPermissoes(); // 🆕 APLICAR PERMISSÕES
});
