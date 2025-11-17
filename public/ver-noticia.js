document.addEventListener('DOMContentLoaded', () => {
    const url = "http://localhost:3030/noticias";

    // Elementos da página
    const tituloElement = document.getElementById('noticia-titulo');
    const imagemElement = document.getElementById('noticia-imagem');
    const descricaoElement = document.getElementById('noticia-descricao');
    const conteudoElement = document.getElementById('noticia-conteudo');
    const dataElement = document.getElementById('noticia-data');
    const visualizacoesElement = document.getElementById('noticia-visualizacoes');
    const statusElement = document.getElementById('noticia-status');

    // Buscar ID da notícia da URL
    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get('id');

    console.log('ID da notícia:', noticiaId); // Debug

    if (!noticiaId) {
        mostrarErro('ID da notícia não especificado.');
        return;
    }

    carregarNoticia(noticiaId);

    async function carregarNoticia(id) {
        try {
            console.log('Buscando notícia com ID:', id); // Debug

            const response = await fetch(`${url}/${id}`);

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Notícia não encontrada`);
            }

            const noticia = await response.json();
            console.log('Notícia encontrada:', noticia); // Debug

            if (!noticia || !noticia.id) {
                throw new Error('Notícia inválida ou vazia');
            }

            exibirNoticia(noticia);
            await atualizarVisualizacoes(noticia);

        } catch (error) {
            console.error('Erro ao carregar notícia:', error);
            mostrarErro('Notícia não encontrada ou erro ao carregar.');
        }
    }

    function exibirNoticia(noticia) {
        try {
            // Preencher os dados da notícia com valores padrão
            tituloElement.textContent = noticia.titulo || 'Título não disponível';
            descricaoElement.textContent = noticia.descricaoCurta || 'Descrição não disponível';
            conteudoElement.textContent = noticia.noticiaCompleta || 'Conteúdo não disponível';
            dataElement.textContent = noticia.dataCriacao || 'Data não informada';
            visualizacoesElement.textContent = `${noticia.visualizacoes || '0'} visualizações`;
            statusElement.textContent = noticia.status || 'Rascunho';

            // Configurar imagem
            if (noticia.imagemUrl && noticia.imagemUrl !== '' && noticia.imagemUrl !== 'undefined') {
                imagemElement.src = noticia.imagemUrl;
                imagemElement.alt = noticia.titulo || 'Imagem da notícia';
                imagemElement.style.display = 'block';

                // Tratar erro de carregamento de imagem
                imagemElement.onerror = function () {
                    this.style.display = 'none';
                };
            } else {
                imagemElement.style.display = 'none';
            }

            // Atualizar título da página
            document.title = `${noticia.titulo || 'Notícia'} | Amparo Animal`;

        } catch (error) {
            console.error('Erro ao exibir notícia:', error);
            mostrarErro('Erro ao carregar conteúdo da notícia.');
        }
    }

    async function atualizarVisualizacoes(noticia) {
        try {
            const visualizacoesAtualizadas = parseInt(noticia.visualizacoes || '0') + 1;

            console.log('Atualizando visualizações para:', visualizacoesAtualizadas); // Debug

            const noticiaAtualizada = {
                ...noticia,
                visualizacoes: visualizacoesAtualizadas.toString()
            };

            const response = await fetch(`${url}/${noticia.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(noticiaAtualizada)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar visualizações');
            }

            // Atualizar contador na página
            visualizacoesElement.textContent = `${visualizacoesAtualizadas} visualizações`;

        } catch (error) {
            console.error('Erro ao atualizar visualizações:', error);
            // Não mostrar alerta para o usuário, apenas logar o erro
        }
    }

    function mostrarErro(mensagem) {
        const main = document.querySelector('main');
        main.innerHTML = `
            <div class="text-center p-4">
                <h2 class="text-danger">Erro</h2>
                <p class="mb-3">${mensagem}</p>
                <a href="noticia.html" class="botao-principal">Voltar para Notícias</a>
            </div>
        `;
    }

    // Função de compartilhamento
    window.compartilhar = function (plataforma) {
        const titulo = document.getElementById('noticia-titulo')?.textContent || 'Notícia Amparo Animal';
        const url = window.location.href;

        let shareUrl = '';

        switch (plataforma) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(titulo + ' ' + url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };
});