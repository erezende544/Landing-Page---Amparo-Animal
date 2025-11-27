document.addEventListener("DOMContentLoaded", () => {
    const url = "http://localhost:3001/noticias";

    // Elementos da página
    // Elementos da página
    const tituloElement = document.getElementById('noticia-titulo');
    const imagemElement = document.getElementById('noticia-imagem');
    const descricaoElement = document.getElementById('noticia-descricao');
    const conteudoElement = document.getElementById('noticia-conteudo');
    const dataElement = document.getElementById('noticia-data');
    const visualizacoesElement = document.getElementById('noticia-visualizacoes');
    const statusElement = document.getElementById('noticia-status');

    // =============================================
    // SISTEMA DE PERMISSÕES - VER NOTÍCIA
    // =============================================

    const PermissoesNoticia = {
        // Verificar se usuário atual é admin
        isAdmin() {
            const userEmail = localStorage.getItem("LOGGED_USER_EMAIL");
            return userEmail === "eduardo.machado@sga.pucminas.br"; // Email do admin
        },

        // Aplicar permissões na página de notícia
        aplicarPermissoes() {
            const isAdmin = this.isAdmin();

            // Elementos que só admins veem
            const elementosAdmin = ["noticia-visualizacoes"];

            elementosAdmin.forEach((id) => {
                const elemento = document.getElementById(id);
                if (elemento) {
                    // Encontrar o container pai (o small que contém o elemento)
                    const container = elemento.closest("small");
                    if (container) {
                        container.style.display = isAdmin ? "inline-flex" : "none";
                    }
                }
            });

            // Também esconder o "Publicado pelo Amparo Animal" se não for admin
            const publicadoPor = document.querySelector(
                'small.text-muted:contains("Publicado pelo")'
            );
            if (publicadoPor && !isAdmin) {
                publicadoPor.style.display = "none";
            }

            console.log("Permissões aplicadas na notícia - Admin:", isAdmin);
        },
    };

    console.log("Página de notícia carregada");

    // Buscar ID da notícia da URL
    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get("id");

    if (!noticiaId) {
        mostrarErro("ID da notícia não especificado.");
        return;
    }

    console.log("Carregando notícia ID:", noticiaId);
    carregarNoticia(noticiaId);

    async function carregarNoticia(id) {
        try {
            console.log("Fazendo fetch para:", `${url}/${id}`);
            const response = await fetch(`${url}/${id}`);

            if (!response.ok) {
                throw new Error("Notícia não encontrada");
            }

            const noticia = await response.json();
            console.log("Notícia carregada:", noticia.titulo);

            exibirNoticia(noticia);
        } catch (error) {
            console.error("Erro ao carregar notícia:", error);
            mostrarErro("Notícia não encontrada.");
        }
    }

    function exibirNoticia(noticia) {
        console.log('Exibindo notícia no DOM');

        // Preencher os dados da notícia
        tituloElement.textContent = noticia.titulo;
        descricaoElement.textContent = noticia.descricaoCurta;
        conteudoElement.textContent = noticia.noticiaCompleta;

        // 🎯 PREENCHER TODOS OS DADOS (AS PERMISSÕES SERÃO APLICADAS DEPOIS)
        dataElement.textContent = noticia.dataCriacao || 'Data não informada';
        visualizacoesElement.textContent = `${noticia.visualizacoes || '0'} visualizações`;
        statusElement.textContent = noticia.status || 'Publicada'; // 🆕 ADICIONAR STATUS

        // Configurar imagem
        const imagemContainer = document.getElementById('noticia-imagem-container');
        if (noticia.imagemUrl && noticia.imagemUrl !== '') {
            console.log('Carregando imagem:', noticia.imagemUrl);
            imagemElement.src = noticia.imagemUrl;
            imagemElement.alt = noticia.titulo;

            imagemElement.onload = () => {
                console.log('Imagem carregada com sucesso');
            };

            imagemElement.onerror = () => {
                console.log('Erro ao carregar imagem, usando placeholder');
                imagemElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBlOWUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZkNGM0MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBkYSBOb3TDrWNpYTwvdGV4dD48L3N2Zz4=';
                imagemContainer.querySelector('.card-img-overlay').style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)';
            };
        } else {
            console.log('Sem imagem, usando placeholder');
            imagemElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBlOWUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZkNGM0MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBkYSBOb3TDrWNpYTwvdGV4dD48L3N2Zz4=';
            imagemContainer.querySelector('.card-img-overlay').style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)';
        }

        // Atualizar título da página
        document.title = `${noticia.titulo} | Amparo Animal`;

        // 🎯 APLICAR PERMISSÕES DEPOIS DE CARREGAR TUDO
        setTimeout(() => {
            PermissoesNoticia.aplicarPermissoes();
        }, 100);

        console.log('Página totalmente carregada');
    }

    function mostrarErro(mensagem) {
        console.log("Mostrando erro:", mensagem);
        const main = document.querySelector("main");
        main.innerHTML = `
            <div class="text-center">
                <h2>Erro</h2>
                <p>${mensagem}</p>
                <a href="noticia.html" class="botao-principal">Voltar para Notícias</a>
            </div>
        `;
    }

    // Função de compartilhamento
    window.compartilhar = function (plataforma) {
        console.log("Compartilhando via:", plataforma);
        const titulo = document.getElementById("noticia-titulo").textContent;
        const url = window.location.href;

        let shareUrl = "";

        switch (plataforma) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`;
                break;
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodeURIComponent(titulo + " " + url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400");
        }
    };
});
