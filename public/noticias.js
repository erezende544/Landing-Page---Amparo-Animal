document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos na página correta
    const listaDeNoticias = document.getElementById('lista-de-noticias');
    if (!listaDeNoticias) {
        console.log('Notícias.js: Não está na página de gerenciamento de notícias');
        return;
    }

    const url = "http://localhost:3030/noticias";

    const viewLista = document.getElementById('view-lista');
    const viewFormulario = document.getElementById('view-formulario');
    const botaoNovaNoticia = document.getElementById('botao-nova-noticia');
    const formularioDeNoticia = document.getElementById('formulario-de-noticia');
    const campoIdDaNoticia = document.getElementById('noticia-id');
    const tituloFormulario = document.getElementById('titulo-formulario');
    const campoTitulo = document.getElementById('titulo');
    const campoImagemUrl = document.getElementById('imagemUrl');
    const campoDescricaoCurta = document.getElementById('descricaoCurta');
    const campoNoticiaCompleta = document.getElementById('noticiaCompleta');
    const imagemPreview = document.getElementById('imagem-preview');
    const infoStatus = document.getElementById('info-status');
    const infoVisualizacoes = document.getElementById('info-visualizacoes');
    const infoDataCriacao = document.getElementById('info-data-criacao');
    const botaoSalvar = document.getElementById('botao-salvar');
    const botaoExcluirForm = document.getElementById('botao-excluir-form');
    const botaoNovoForm = document.getElementById('botao-novo-form');
    const botaoCancelar = document.getElementById('botao-cancelar');

    let noticias = [];

    // Alterna entre lista e formulário
    const mostrarView = (view) => {
        if (view === 'formulario') {
            viewLista.style.display = 'none';
            viewFormulario.style.display = 'block';
            window.scrollTo(0, 0);
        } else {
            viewFormulario.style.display = 'none';
            viewLista.style.display = 'block';
        }
    };

    // --- CRUD ---
    const buscarNoticias = async () => {
        try {
            const response = await fetch(url);
            noticias = await response.json();
            noticias.sort((a, b) => Number(a.id) - Number(b.id));
            apresentarNoticias();
        } catch (error) {
            console.error(error);
            listaDeNoticias.innerHTML = `<p>Erro ao carregar notícias.</p>`;
        }
    };

    const enviarNoticia = async (noticia) => {
        try {
            const maiorId = noticias.reduce((max, n) => Math.max(max, Number(n.id)), 0);
            noticia.id = String(maiorId + 1);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(noticia)
            });
            if (!response.ok) throw new Error('Erro ao enviar notícia');
            await buscarNoticias();
            mostrarView('lista');
            limparFormulario();
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar notícia!");
        }
    };

    const atualizarNoticia = async (id, noticia) => {
        try {
            const response = await fetch(`${url}/${Number(id)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(noticia)
            });
            if (!response.ok) throw new Error('Erro ao atualizar');
            await buscarNoticias();
            mostrarView('lista');
            limparFormulario();
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar notícia!");
        }
    };

    const excluirNoticia = async (id) => {
        try {
            const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Falha ao excluir notícia ${id}`);
            await buscarNoticias();
            limparFormulario();
            mostrarView('lista');
        } catch (error) {
            console.error('Erro ao excluir notícia:', error);
            alert('Erro ao excluir notícia!');
        }
    };

    // --- Renderização ---
    const apresentarNoticias = () => {
        listaDeNoticias.innerHTML = '';

        if (noticias.length === 0) {
            listaDeNoticias.innerHTML = '<p>Nenhuma notícia cadastrada.</p>';
            return;
        }

        noticias.forEach(noticia => {
            const cartao = document.createElement('div');
            cartao.className = 'cartao-noticia';

            cartao.innerHTML = `
                <img src="${noticia.imagemUrl}" alt="${noticia.titulo}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Sem+Imagem'">
                <div class="cartao-noticia-conteudo">
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.descricaoCurta}</p>
                    <div class="cartao-noticia-acoes">
                        <button type="button" class="botao-de-acao botao-ver" data-id="${noticia.id}">
                            <i class="bi bi-eye me-1"></i>Ver Notícia
                        </button>
                        <button type="button" class="botao-de-acao botao-editar" data-id="${noticia.id}">
                            <i class="bi bi-pencil me-1"></i>Editar
                        </button>
                        <button type="button" class="botao-de-acao botao-excluir" data-id="${noticia.id}">
                            <i class="bi bi-trash me-1"></i>Excluir
                        </button>
                    </div>
                </div>`;
            listaDeNoticias.appendChild(cartao);
        });
    };

    // --- Formulário ---
    const limparFormulario = () => {
        formularioDeNoticia.reset();
        campoIdDaNoticia.value = '';
        tituloFormulario.textContent = 'Adicionar Nova Notícia';
        botaoSalvar.textContent = 'Salvar';
        botaoExcluirForm.style.display = 'none';
        botaoNovoForm.style.display = 'none';
        imagemPreview.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem';
        infoStatus.textContent = '--';
        infoVisualizacoes.textContent = '--';
        infoDataCriacao.textContent = '--';
    };

    const preencherFormularioParaEdicao = (noticia) => {
        campoIdDaNoticia.value = noticia.id;
        campoTitulo.value = noticia.titulo;
        campoImagemUrl.value = noticia.imagemUrl;
        campoDescricaoCurta.value = noticia.descricaoCurta;
        campoNoticiaCompleta.value = noticia.noticiaCompleta;
        imagemPreview.src = noticia.imagemUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
        infoStatus.textContent = noticia.status || '--';
        infoVisualizacoes.textContent = noticia.visualizacoes || '--';
        infoDataCriacao.textContent = noticia.dataCriacao || '--';
        tituloFormulario.textContent = `Editar Notícia (ID: ${noticia.id})`;
        botaoSalvar.textContent = 'Salvar Alterações';
        botaoExcluirForm.style.display = 'grid';
        botaoNovoForm.style.display = 'grid';
        mostrarView('formulario');
    };

    // Função para abrir notícia em página separada
    const abrirNoticiaEmPaginaSeparada = (noticia) => {
        window.location.href = `ver-noticia.html?id=${noticia.id}`;
    };

    // --- Eventos ---
    campoImagemUrl.addEventListener('input', () => {
        const urlImagem = campoImagemUrl.value;
        imagemPreview.src = urlImagem ? urlImagem : 'https://via.placeholder.com/300x200?text=Sem+Imagem';
    });

    formularioDeNoticia.addEventListener('submit', async event => {
        event.preventDefault();

        const id = campoIdDaNoticia.value;

        const noticia = {
            titulo: campoTitulo.value,
            imagemUrl: campoImagemUrl.value,
            descricaoCurta: campoDescricaoCurta.value,
            noticiaCompleta: campoNoticiaCompleta.value,
            status: infoStatus.textContent === '--' ? 'Rascunho' : infoStatus.textContent,
            visualizacoes: infoVisualizacoes.textContent === '--' ? '0' : infoVisualizacoes.textContent,
            dataCriacao: infoDataCriacao.textContent === '--' ? new Date().toLocaleDateString('pt-BR') : infoDataCriacao.textContent
        };

        if (id) {
            await atualizarNoticia(Number(id), noticia);
        } else {
            await enviarNoticia(noticia);
        }
    });

    listaDeNoticias.addEventListener('click', async event => {
        const botaoVer = event.target.closest('.botao-ver');
        const botaoEditar = event.target.closest('.botao-editar');
        const botaoExcluir = event.target.closest('.botao-excluir');

        if (botaoVer) {
            console.log('🔍 Botão Ver clicado, ID:', botaoVer.dataset.id);
            const id = botaoVer.dataset.id;
            const noticia = noticias.find(n => n.id == id); // Use == para comparar
            console.log('🔍 Notícia encontrada:', noticia);

            if (noticia) {
                abrirNoticiaEmPaginaSeparada(noticia);
            } else {
                console.error('❌ Notícia não encontrada para o ID:', id);
                alert('Erro: Notícia não encontrada!');
            }
            return;
        }
        if (botaoEditar) {
            const id = botaoEditar.dataset.id;
            const noticia = noticias.find(n => n.id === id);
            if (noticia) preencherFormularioParaEdicao(noticia);
            return;
        }

        if (botaoExcluir) {
            const id = botaoExcluir.dataset.id;
            if (confirm('Tem certeza que deseja excluir esta notícia?')) {
                await excluirNoticia(id);
                alert('Notícia excluída com sucesso!');
            }
            return;
        }
    });

    botaoNovaNoticia.addEventListener('click', () => {
        limparFormulario();
        mostrarView('formulario');
    });

    botaoCancelar.addEventListener('click', () => {
        limparFormulario();
        mostrarView('lista');
    });

    botaoExcluirForm.addEventListener('click', async () => {
        const idParaExcluir = Number(campoIdDaNoticia.value);
        if (idParaExcluir && confirm('Tem certeza que deseja EXCLUIR esta notícia PERMANENTEMENTE?')) {
            await excluirNoticia(idParaExcluir);
            alert('Notícia excluída com sucesso!');
        }
    });

    botaoNovoForm.addEventListener('click', () => {
        limparFormulario();
        mostrarView('formulario');
    });

    // Inicialização
    mostrarView('lista');
    buscarNoticias();
});