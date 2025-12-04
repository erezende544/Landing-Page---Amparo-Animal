import { API_URL } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {

    const elementos = {
        heroCarrossel: document.getElementById('hero-carrossel'),
        heroIndicadores: document.getElementById('hero-indicadores'),
        noticias: document.getElementById('carrossel-noticias-container'),
        animais: document.getElementById('carrossel-animais-container'),
        planos: document.getElementById('planos-container'),
        itens: document.getElementById('itens-container'),
        posts: document.getElementById('posts-container')
    };

    let estado = {
        noticias: [],
        animais: [],
        planos: [],
        itens: [],
        posts: [],
        slideHero: 0,
        slideNoticias: 0,
        slideAnimais: 0,
        isDragging: false,
        startPos: 0,
        currentTranslate: 0,
        prevTranslate: 0,
        animationID: null
    };

    inicializar();

    async function inicializar() {
        await carregarTodosDados();
        criarHeroCarrossel();
        configurarEventListeners();
        configurarModais();
        configurarDragCarrossel();
    }

    async function carregarTodosDados() {
        try {
            await Promise.all([
                carregarNoticias(),
                carregarAnimais(),
                carregarPlanos(),
                carregarItens(),
                carregarPosts()
            ]);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            carregarDadosFallback();
        }
    }

    function carregarDadosFallback() {
        console.log('Usando dados de fallback');

        estado.noticias = [{
            id: "1",
            titulo: "Cuidados Essenciais com Seu Pet no Verão",
            descricaoCurta: "Aprenda como proteger seu animal de estimação nos dias mais quentes do ano",
            imagemUrl: "https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg"
        }];

        estado.animais = [{
            id: 1,
            nome: "Mel",
            idade: "Filhote",
            especie: "Cachorro",
            raca: "Vira-lata",
            sexo: "Fêmea",
            foto: "https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg",
            descricao: "Filhote dócil, gosta de brincar."
        }];

        estado.planos = [{
            id: 1,
            nome: "Plano Bronze",
            valor: 35,
            descricao: "Ajuda a cobrir a alimentação",
            vantagens: [
                "Contribui para ração mensal",
                "Ajuda na manutenção do abrigo",
                "Receba atualizações periódicas"
            ]
        }];

        estado.itens = [{
            id: 1,
            usuario: "José",
            nome: "cama-cachorro",
            tempoUso: "6 meses",
            tipoAnimal: "cachorro",
            porte: "medio",
            fotoItem: "https://images.pexels.com/photos/128817/pexels-photo-128817.jpeg",
            descricao: "cama de cachorro com 6 meses de uso, em ótimo estado para cães de médio porte"
        }];

        estado.posts = [{
            id: 1,
            usuario: "Ana Silva",
            fotoUsuario: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
            titulo: "Minha experiência com a adoção da Mel",
            conteudo: "Conheci a Mel através do site e foi amor à primeira vista! O processo de adoção foi rápido e muito organizado. Hoje ela é parte da família!",
            fotoPost: "https://images.pexels.com/photos/733416/pexels-photo-733416.jpeg"
        }];

        criarHeroCarrossel();
        exibirNoticias();
        exibirAnimais();
        exibirPlanos();
        exibirItens();
        exibirPosts();
    }

    function criarHeroCarrossel() {
        elementos.heroCarrossel.innerHTML = '';
        elementos.heroIndicadores.innerHTML = '';

        const slideHero = criarSlideHero();
        elementos.heroCarrossel.appendChild(slideHero);

        if (estado.noticias.length > 0) {
            const slideNoticia = criarSlideNoticia(estado.noticias[0]);
            elementos.heroCarrossel.appendChild(slideNoticia);
        }

        if (estado.animais.length > 0) {
            const slideAnimal = criarSlideAnimal(estado.animais[0]);
            elementos.heroCarrossel.appendChild(slideAnimal);
        }

        if (estado.posts.length > 0) {
            const slidePost = criarSlidePost(estado.posts[0]);
            elementos.heroCarrossel.appendChild(slidePost);
        }

        criarIndicadoresHero();
    }

    function criarSlideHero() {
        const slide = document.createElement('div');
        slide.className = 'carrossel-slide hero-slide';
        slide.innerHTML = `
            <div class="slide-content">
                <h1 class="hero-title">Transforme Vidas Animais</h1>
                <p class="hero-subtitle">Apadrinhe, doe ou adote. Faça parte dessa corrente do bem</p>
                <div class="hero-buttons">
                    <a href="#apadrinhar" class="btn btn-primary">Apadrinhar um Animal</a>
                    <a href="#doacoes" class="btn btn-secondary">Doar Itens</a>
                </div>
            </div>
        `;
        return slide;
    }

    function criarSlideNoticia(noticia) {
        const slide = document.createElement('div');
        slide.className = 'carrossel-slide noticia-slide';
        slide.style.background = `linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(90, 111, 216, 0.7) 100%), url('${noticia.imagemUrl}') center/cover`;
        slide.innerHTML = `
            <div class="slide-content">
                <span class="slide-badge">Notícia em Destaque</span>
                <h2 class="slide-title">${noticia.titulo}</h2>
                <p class="slide-desc">${noticia.descricaoCurta}</p>
                <a href="#noticias" class="btn btn-outline">Ler Notícia Completa</a>
            </div>
        `;
        return slide;
    }

    function criarSlideAnimal(animal) {
        const slide = document.createElement('div');
        slide.className = 'carrossel-slide animal-slide';
        slide.style.background = `linear-gradient(135deg, rgba(167, 194, 16, 0.7) 0%, rgba(149, 178, 12, 0.7) 100%), url('${animal.foto}') center/cover`;
        slide.innerHTML = `
            <div class="slide-content">
                <span class="slide-badge">Para Apadrinhar</span>
                <h2 class="slide-title">Conheça ${animal.nome}</h2>
                <p class="slide-desc">${animal.descricao}</p>
                <div class="animal-info">
                    <p><strong>Idade:</strong> ${animal.idade}</p>
                    <p><strong>Raça:</strong> ${animal.raca}</p>
                </div>
                <button class="btn btn-primary" onclick="apadrinharAnimal(${animal.id})">Apadrinhar ${animal.nome}</button>
            </div>
        `;
        return slide;
    }

    function criarSlidePost(post) {
        const slide = document.createElement('div');
        slide.className = 'carrossel-slide post-slide';
        const backgroundImage = post.fotoPost || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg';
        slide.style.background = `linear-gradient(135deg, rgba(79, 172, 254, 0.7) 0%, rgba(58, 157, 232, 0.7) 100%), url('${backgroundImage}') center/cover`;
        slide.innerHTML = `
            <div class="slide-content">
                <span class="slide-badge">História da Comunidade</span>
                <h2 class="slide-title">${post.titulo}</h2>
                <p class="slide-desc">${post.conteudo.substring(0, 150)}...</p>
                <div class="post-author">
                    <p><strong>Por:</strong> ${post.usuario}</p>
                </div>
                <a href="#comunidade" class="btn btn-outline">Ver Mais Histórias</a>
            </div>
        `;
        return slide;
    }

    function criarIndicadoresHero() {
        const totalSlides = elementos.heroCarrossel.children.length;
        for (let i = 0; i < totalSlides; i++) {
            const indicador = document.createElement('button');
            indicador.className = `carrossel-indicador ${i === 0 ? 'ativo' : ''}`;
            indicador.addEventListener('click', () => irParaSlideHero(i));
            elementos.heroIndicadores.appendChild(indicador);
        }
    }

    function configurarDragCarrossel() {
        const container = elementos.heroCarrossel;

        container.addEventListener('mousedown', dragStart);
        container.addEventListener('touchstart', dragStart);
        container.addEventListener('mouseup', dragEnd);
        container.addEventListener('touchend', dragEnd);
        container.addEventListener('mousemove', drag);
        container.addEventListener('touchmove', drag);
        container.addEventListener('mouseleave', dragEnd);

        container.addEventListener('dragstart', (e) => e.preventDefault());
        window.addEventListener('resize', setPositionByIndex);
    }

    function dragStart(event) {
        event.preventDefault();
        estado.isDragging = true;
        estado.startPos = getPositionX(event);
        estado.animationID = requestAnimationFrame(animation);
        elementos.heroCarrossel.style.cursor = 'grabbing';
        elementos.heroCarrossel.style.transition = 'none';
    }

    function drag(event) {
        if (!estado.isDragging) return;
        const currentPosition = getPositionX(event);
        estado.currentTranslate = estado.prevTranslate + currentPosition - estado.startPos;
    }

    function dragEnd() {
        if (!estado.isDragging) return;
        estado.isDragging = false;
        cancelAnimationFrame(estado.animationID);

        const movedBy = estado.currentTranslate - estado.prevTranslate;
        const containerWidth = elementos.heroCarrossel.offsetWidth;

        if (Math.abs(movedBy) > containerWidth * 0.1) {
            if (movedBy > 0 && estado.slideHero > 0) {
                estado.slideHero--;
            } else if (movedBy < 0 && estado.slideHero < elementos.heroCarrossel.children.length - 1) {
                estado.slideHero++;
            }
        }

        setPositionByIndex();
        elementos.heroCarrossel.style.cursor = 'grab';
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (estado.isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        elementos.heroCarrossel.style.transform = `translateX(${estado.currentTranslate}px)`;
    }

    function setPositionByIndex() {
        const slideWidth = elementos.heroCarrossel.offsetWidth;
        estado.currentTranslate = estado.slideHero * -slideWidth;
        estado.prevTranslate = estado.currentTranslate;
        setSliderPosition();

        document.querySelectorAll('#hero-indicadores .carrossel-indicador').forEach((ind, index) => {
            ind.classList.toggle('ativo', index === estado.slideHero);
        });

        elementos.heroCarrossel.style.transition = 'transform 0.3s ease';
    }

    function irParaSlideHero(index) {
        estado.slideHero = index;
        setPositionByIndex();
    }

    function configurarNavegacaoHero() {
        document.getElementById('hero-prev').addEventListener('click', () => {
            if (estado.slideHero > 0) {
                estado.slideHero--;
                setPositionByIndex();
            }
        });

        document.getElementById('hero-next').addEventListener('click', () => {
            if (estado.slideHero < elementos.heroCarrossel.children.length - 1) {
                estado.slideHero++;
                setPositionByIndex();
            }
        });
    }

    async function carregarNoticias() {
        const response = await fetch(`${API_URL}/noticias`);
        estado.noticias = await response.json();
        exibirNoticias();
    }

    async function carregarAnimais() {
        const response = await fetch(`${API_URL}/animais`);
        estado.animais = await response.json();
        exibirAnimais();
    }

    async function carregarPlanos() {
        const response = await fetch(`${API_URL}/planos`);
        estado.planos = await response.json();
        exibirPlanos();
    }

    async function carregarItens() {
        const response = await fetch(`${API_URL}/itens`);
        estado.itens = await response.json();
        exibirItens();
    }

    async function carregarPosts() {
        const response = await fetch(`${API_URL}/posts`);
        estado.posts = await response.json();
        exibirPosts();
    }

    function exibirNoticias() {
        if (!elementos.noticias) return;

        elementos.noticias.innerHTML = '';

        estado.noticias.forEach(noticia => {
            const cartao = document.createElement('div');
            cartao.className = 'cartao-noticia';
            cartao.innerHTML = `
                <img src="${noticia.imagemUrl}" alt="${noticia.titulo}">
                <div class="cartao-noticia-conteudo">
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.descricaoCurta}</p>
                    <button class="btn btn-primary">Ler Mais</button>
                </div>
            `;
            elementos.noticias.appendChild(cartao);
        });
    }

    function exibirAnimais() {
        if (!elementos.animais) return;

        elementos.animais.innerHTML = '';

        estado.animais.forEach(animal => {
            const cartao = document.createElement('div');
            cartao.className = 'cartao-animal';
            cartao.innerHTML = `
                <img src="${animal.foto}" alt="${animal.nome}">
                <div class="cartao-animal-conteudo">
                    <h3>${animal.nome}</h3>
                    <div class="cartao-animal-info">
                        <p><strong>Idade:</strong> ${animal.idade}</p>
                        <p><strong>Raça:</strong> ${animal.raca}</p>
                        <p><strong>Sexo:</strong> ${animal.sexo}</p>
                    </div>
                    <p>${animal.descricao}</p>
                    <button class="btn btn-primary" onclick="apadrinharAnimal(${animal.id})">Apadrinhar</button>
                </div>
            `;
            elementos.animais.appendChild(cartao);
        });
    }

    function exibirPlanos() {
        if (!elementos.planos) return;

        elementos.planos.innerHTML = '';

        estado.planos.forEach((plano, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-4';

            const cartao = document.createElement('div');
            cartao.className = `cartao-plano ${index === 1 ? 'destaque' : ''}`;
            cartao.innerHTML = `
                <h4>${plano.nome}</h4>
                <div class="plano-preco">R$ ${plano.valor}</div>
                <p>${plano.descricao}</p>
                <ul class="plano-vantagens">
                    ${plano.vantagens.map(vantagem => `<li>${vantagem}</li>`).join('')}
                </ul>
                <button class="btn btn-primary" onclick="escolherPlano(${plano.id})">Escolher Plano</button>
            `;

            col.appendChild(cartao);
            elementos.planos.appendChild(col);
        });
    }

    function exibirItens() {
        if (!elementos.itens) return;

        elementos.itens.innerHTML = '';

        estado.itens.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6';

            const cartao = document.createElement('div');
            cartao.className = 'cartao-item';
            cartao.innerHTML = `
                <img src="${item.fotoItem}" alt="${item.nome}">
                <div class="cartao-item-conteudo">
                    <h4>${item.nome}</h4>
                    <div class="cartao-item-info">
                        <p><strong>Doador:</strong> ${item.usuario}</p>
                        <p><strong>Tempo de uso:</strong> ${item.tempoUso}</p>
                        <p><strong>Para:</strong> ${item.tipoAnimal} - ${item.porte}</p>
                    </div>
                    <p>${item.descricao}</p>
                    <button class="btn btn-secondary">Me Interesso</button>
                </div>
            `;

            col.appendChild(cartao);
            elementos.itens.appendChild(col);
        });
    }

    function exibirPosts() {
        if (!elementos.posts) return;

        elementos.posts.innerHTML = '';

        estado.posts.forEach(post => {
            const col = document.createElement('div');
            col.className = 'col-lg-6';

            const cartao = document.createElement('div');
            cartao.className = 'cartao-post';
            cartao.innerHTML = `
                <div class="post-header">
                    <img src="${post.fotoUsuario}" alt="${post.usuario}">
                    <div>
                        <h5>${post.usuario}</h5>
                        <small>${new Date(post.dataCriacao).toLocaleDateString('pt-BR')}</small>
                    </div>
                </div>
                <div class="post-conteudo">
                    <h4>${post.titulo}</h4>
                    <p>${post.conteudo}</p>
                    ${post.fotoPost ? `<img src="${post.fotoPost}" class="post-imagem" alt="Post image">` : ''}
                </div>
            `;

            col.appendChild(cartao);
            elementos.posts.appendChild(col);
        });
    }

    function configurarCarrossel(tipo) {
        const container = elementos[tipo];
        const prevBtn = document.getElementById(`${tipo}-prev`);
        const nextBtn = document.getElementById(`${tipo}-next`);

        if (!container || !prevBtn || !nextBtn) return;

        const slideWidth = container.children[0]?.offsetWidth + 32;
        const slidesToShow = window.innerWidth < 768 ? 1 : 3;

        prevBtn.addEventListener('click', () => {
            estado[`slide${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`] =
                Math.max(0, estado[`slide${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`] - 1);
            atualizarCarrossel(tipo, slideWidth, slidesToShow);
        });

        nextBtn.addEventListener('click', () => {
            const maxSlides = Math.ceil(estado[tipo].length / slidesToShow) - 1;
            estado[`slide${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`] =
                Math.min(maxSlides, estado[`slide${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`] + 1);
            atualizarCarrossel(tipo, slideWidth, slidesToShow);
        });
    }

    function atualizarCarrossel(tipo, slideWidth, slidesToShow) {
        const container = elementos[tipo];
        const translateX = -estado[`slide${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`] * slideWidth * slidesToShow;
        container.style.transform = `translateX(${translateX}px)`;
    }

    function configurarModais() {
        const btnLogin = document.getElementById('btn-login');
        const btnCadastrar = document.getElementById('btn-cadastrar');

        if (btnLogin && btnCadastrar) {
            const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));
            const modalCadastro = new bootstrap.Modal(document.getElementById('modalCadastro'));

            btnLogin.addEventListener('click', () => modalLogin.show());
            btnCadastrar.addEventListener('click', () => modalCadastro.show());

            document.getElementById('form-login').addEventListener('submit', handleLogin);
            document.getElementById('form-cadastro').addEventListener('submit', handleCadastro);
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        alert('Login realizado com sucesso!');
        bootstrap.Modal.getInstance(document.getElementById('modalLogin')).hide();
    }

    async function handleCadastro(e) {
        e.preventDefault();
        alert('Cadastro realizado com sucesso!');
        bootstrap.Modal.getInstance(document.getElementById('modalCadastro')).hide();
    }

    function configurarEventListeners() {
        configurarNavegacaoHero();
        configurarCarrossel('noticias');
        configurarCarrossel('animais');

        window.addEventListener('resize', () => {
            setPositionByIndex();
            configurarCarrossel('noticias');
            configurarCarrossel('animais');
        });
    }

    window.apadrinharAnimal = function (animalId) {
        alert(`Redirecionando para apadrinhamento do animal ${animalId}`);
    };

    window.escolherPlano = function (planoId) {
        alert(`Plano ${planoId} selecionado!`);
    };
});