document.addEventListener("DOMContentLoaded", () => {
    const url = "http://localhost:3001/noticias";

    // Elementos da página
    const tituloElement = document.getElementById('noticia-titulo');
    const imagemElement = document.getElementById('noticia-imagem');
    const descricaoElement = document.getElementById('noticia-descricao');
    const conteudoElement = document.getElementById('noticia-conteudo');
    const dataElement = document.getElementById('noticia-data');
    const visualizacoesElement = document.getElementById('noticia-visualizacoes');
    const statusElement = document.getElementById('noticia-status');

    console.log("📄 Página de notícia carregada");

    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get("id");

    if (!noticiaId) {
        mostrarErro("ID da notícia não especificado.");
        return;
    }

    console.log("🔍 Buscando notícia ID:", noticiaId);
    carregarNoticia(noticiaId);

    // =============================================
    // FUNÇÃO PRINCIPAL - SEGURA CONTRA LOOPS
    // =============================================
    async function carregarNoticia(id) {
        console.log("🔄 Iniciando carregamento...");

        try {
            // 1. Primeiro busca a notícia
            const response = await fetch(`${url}/${id}`);

            if (!response.ok) {
                console.error("❌ Erro HTTP:", response.status);
                mostrarErro(`Notícia não encontrada (Erro ${response.status})`);
                return;
            }

            const noticia = await response.json();
            console.log("✅ Notícia carregada:", noticia.titulo);

            // 2. Exibe a notícia imediatamente
            exibirNoticia(noticia);

            // 3. Incrementa visualizações APENAS UMA VEZ (com proteção)
            setTimeout(() => {
                incrementarVisualizacoesSeguro(id, noticia);
            }, 500); // Pequeno delay para garantir que a página carregou

        } catch (error) {
            console.error("💥 ERRO:", error);
            mostrarErro("Erro de conexão com o servidor.");
        }
    }

    // =============================================
    // INCREMENTO SEGURO - COM VERIFICAÇÃO DE SESSÃO
    // =============================================
    async function incrementarVisualizacoesSeguro(id, noticia) {
        try {
            // Verificação de sessão (mantém)
            const chaveIncremento = `view_incremented_${id}`;
            if (sessionStorage.getItem(chaveIncremento)) {
                console.log("🔄 Visualizações já incrementadas nesta sessão. Pulando...");
                return;
            }

            console.log("📈 Incrementando visualizações...");

            // Calcula novo valor
            const visualizacoesAtuais = parseInt(noticia.visualizacoes) || 0;
            const novasVisualizacoes = visualizacoesAtuais + 1;

            // ⚠️ SOLUÇÃO: Não espera a resposta, só envia e esquece
            fetch(`${url}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    ...noticia,
                    visualizacoes: novasVisualizacoes
                })
            })
                .then(response => {
                    if (!response.ok) {
                        console.error("⚠️ Erro ao atualizar visualizações no servidor");
                    } else {
                        console.log("✅ Visualizações salvas no servidor");
                    }
                })
                .catch(error => {
                    console.error("⚠️ Erro de rede:", error);
                });

            // Marca como incrementado LOCALMENTE (importante!)
            sessionStorage.setItem(chaveIncremento, 'true');

            // Atualiza o número na tela IMEDIATAMENTE
            visualizacoesElement.textContent = `${novasVisualizacoes} visualizações`;

            console.log("📊 Visualizações atualizadas localmente para:", novasVisualizacoes);

        } catch (error) {
            console.error("💥 Erro crítico:", error);
        }
    }
    // =============================================
    // EXIBIR NOTÍCIA
    // =============================================
    function exibirNoticia(noticia) {
        console.log("🎨 Exibindo notícia no DOM");

        // Preenche os dados
        tituloElement.textContent = noticia.titulo || "Sem título";
        descricaoElement.textContent = noticia.descricaoCurta || "Sem descrição";
        conteudoElement.textContent = noticia.noticiaCompleta || "Sem conteúdo";
        dataElement.textContent = noticia.dataCriacao || "Data não informada";
        visualizacoesElement.textContent = `${noticia.visualizacoes || '0'} visualizações`;
        statusElement.textContent = noticia.status || 'Publicada';

        // Imagem
        if (noticia.imagemUrl) {
            imagemElement.src = noticia.imagemUrl;
            imagemElement.alt = noticia.titulo;

            imagemElement.onerror = () => {
                imagemElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBlOWUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZkNGM0MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBkYSBOb3RcImNpYTwvdGV4dD48L3N2Zz4=';
            };
        } else {
            imagemElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBlOWUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZkNGM0MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBkYSBOb3RcImNpYTwvdGV4dD48L3N2Zz4=';
        }

        document.title = `${noticia.titulo} | Amparo Animal`;
        console.log("✨ Página carregada com sucesso!");
    }

    // =============================================
    // TRATAMENTO DE ERROS
    // =============================================
    function mostrarErro(mensagem) {
        console.log("🛑 Mostrando erro:", mensagem);
        const main = document.querySelector("main");
        main.innerHTML = `
            <div class="text-center p-5">
                <h2 class="text-danger">Erro</h2>
                <p class="lead">${mensagem}</p>
                <a href="noticia.html" class="btn btn-primary mt-3">
                    <i class="bi bi-arrow-left"></i> Voltar para Notícias
                </a>
            </div>
        `;
    }

    // =============================================
    // COMPARTILHAMENTO
    // =============================================
    window.compartilhar = function (plataforma) {
        const titulo = document.getElementById("noticia-titulo").textContent;
        const urlAtual = window.location.href;
        let shareUrl = "";

        switch (plataforma) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlAtual)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(urlAtual)}`;
                break;
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodeURIComponent(titulo + " " + urlAtual)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400");
        }
    };
});