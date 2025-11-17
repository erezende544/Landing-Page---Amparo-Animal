// landing page.js - Versão para GitHub Pages
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando Amparo Animal - GitHub Pages');

    const url = "https://002bab58-5cbf-45b6-bfa7-d43590a51bee-00-3irg6wu2u2vbb.picard.replit.dev/";
    let dadosCarregados = null;

    async function carregarTodosDados() {
        try {
            console.log('📡 Carregando dados do JSON...');

            const response = await fetch(dadosUrl);

            if (!response.ok) {
                throw new Error('Arquivo de dados não encontrado');
            }

            dadosCarregados = await response.json();
            console.log('✅ Dados carregados com sucesso');

            renderizarNoticias();
            renderizarAnimais();
            renderizarPlanos();
            renderizarItens();
            renderizarPosts();

        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            usarDadosFallback();
        }
    }

    function usarDadosFallback() {
        console.log('📝 Usando dados de fallback...');
        dadosCarregados = {
            noticias: [],
            animais: [],
            planos: [],
            itens: [],
            posts: []
        };
        renderizarNoticias();
        renderizarAnimais();
        renderizarPlanos();
        renderizarItens();
        renderizarPosts();
    }

    function renderizarNoticias() {
        const container = document.getElementById('noticias-container');
        if (!container) return;

        const noticias = dadosCarregados.noticias.slice(0, 3);
        container.innerHTML = noticias.length > 0 ? noticias.map(noticia => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${noticia.imagemUrl}" class="card-img-top" alt="${noticia.titulo}" 
                         style="height: 200px; object-fit: cover;" onerror="this.style.display='none'">
                    <div class="card-body">
                        <h5 class="card-title">${noticia.titulo}</h5>
                        <p class="card-text">${noticia.descricaoCurta}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">${noticia.dataCriacao}</small>
                        <button class="btn btn-primary btn-sm mt-2 w-100" onclick="verNoticia(${noticia.id})">Ler Mais</button>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="col-12 text-center"><p>Nenhuma notícia disponível</p></div>';
    }

    function renderizarAnimais() {
        const container = document.getElementById('animais-container');
        if (!container) return;

        const animais = dadosCarregados.animais;
        container.innerHTML = animais.length > 0 ? animais.map(animal => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card animal-card h-100">
                    <img src="${animal.imagemUrl}" class="card-img-top" alt="${animal.nome}" 
                         style="height: 250px; object-fit: cover;" onerror="this.style.display='none'">
                    <div class="card-body">
                        <h5 class="card-title">${animal.nome}</h5>
                        <p class="card-text">
                            <strong>Idade:</strong> ${animal.idade}<br>
                            <strong>Raça:</strong> ${animal.raca}<br>
                            <strong>Sexo:</strong> ${animal.sexo}
                        </p>
                        <p class="card-text">${animal.descricao}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary w-100" onclick="apadrinharAnimal(${animal.id})">
                            Apadrinhar ${animal.nome}
                        </button>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="col-12 text-center"><p>Nenhum animal disponível</p></div>';
    }

    function renderizarPlanos() {
        const container = document.getElementById('planos-container');
        if (!container) return;

        const planos = dadosCarregados.planos;
        container.innerHTML = planos.length > 0 ? planos.map(plano => `
            <div class="col-md-4 mb-4">
                <div class="card plano-card h-100">
                    <div class="card-header text-center">
                        <h5>${plano.nome}</h5>
                        <h3 class="text-primary">${plano.preco}</h3>
                        <p class="text-muted">${plano.descricao}</p>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            ${plano.beneficios.map(beneficio => `<li>✓ ${beneficio}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-primary w-100" onclick="escolherPlano(${plano.id})">
                            Escolher Plano
                        </button>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="col-12 text-center"><p>Nenhum plano disponível</p></div>';
    }

    function renderizarItens() {
        const container = document.getElementById('itens-container');
        if (!container) return;

        const itens = dadosCarregados.itens;
        container.innerHTML = itens.length > 0 ? itens.map(item => `
            <div class="col-md-6 mb-4">
                <div class="card item-card h-100">
                    <img src="${item.imagemUrl}" class="card-img-top" alt="${item.nome}" 
                         style="height: 200px; object-fit: cover;" onerror="this.style.display='none'">
                    <div class="card-body">
                        <h5 class="card-title">${item.nome}</h5>
                        <p class="card-text">
                            <strong>Doador:</strong> ${item.doador}<br>
                            <strong>Tempo de uso:</strong> ${item.tempoUso}<br>
                            <strong>Para:</strong> ${item.para}
                        </p>
                        <p class="card-text">${item.descricao}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-success w-100" onclick="interessarItem(${item.id})">
                            Me interesso
                        </button>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="col-12 text-center"><p>Nenhum item disponível</p></div>';
    }

    function renderizarPosts() {
        const container = document.getElementById('posts-container');
        if (!container) return;

        const posts = dadosCarregados.posts;
        container.innerHTML = posts.length > 0 ? posts.map(post => `
            <div class="col-md-6 mb-4">
                <div class="card post-card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <img src="${post.imagemUrl}" class="rounded-circle me-3" 
                                 alt="${post.autor}" style="width: 50px; height: 50px; object-fit: cover;" onerror="this.style.display='none'">
                            <div>
                                <h6 class="mb-0">${post.autor}</h6>
                                <small class="text-muted">${post.data}</small>
                            </div>
                        </div>
                        <h5 class="card-title">${post.titulo}</h5>
                        <p class="card-text">${post.conteudo}</p>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="col-12 text-center"><p>Nenhum post disponível</p></div>';
    }

    // Funções globais
    window.verNoticia = (id) => {
        window.location.href = `noticia.html?id=${id}`;
    };

    window.apadrinharAnimal = (id) => {
        alert(`Obrigado pelo interesse em apadrinhar o animal ID: ${id}! Entraremos em contato.`);
    };

    window.escolherPlano = (id) => {
        alert(`Ótima escolha! Plano ID: ${id} selecionado.`);
    };

    window.interessarItem = (id) => {
        alert(`Interesse registrado no item ID: ${id}! O doador entrará em contato.`);
    };

    // Inicialização
    carregarTodosDados();
});