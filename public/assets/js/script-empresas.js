document.addEventListener('DOMContentLoaded', () => {
    const replit = "localhost:3001/"; // Altere para a URL correta do seu Replit
    const url = replit + "empresas";

    const formulario = document.getElementById('formulario-de-produto');
    const campoId = document.getElementById('empresa-id');
    const botao = document.getElementById('btn-finalizar-apadrinhamento');
    const container = document.getElementById('lista-de-empresas');

    let empresas = [];

    // =========================
    // Funções de API
    // =========================
    const buscarEmpresas = async () => {
        try {
            const response = await fetch(url);
            empresas = await response.json();

            // ordenar para mostrar as mais novas primeiro
            empresas.sort((a, b) => Number(b.id) - Number(a.id));

            mostrarCards();
        } catch (error) {
            console.error(error);
            container.innerHTML = `<p>Erro ao carregar empresas.</p>`;
        }
    };

    const cadastrarEmpresa = async (empresa) => {
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(empresa)
            });

            alert("Empresa cadastrada com sucesso!");

            await buscarEmpresas();
            container.scrollIntoView({ behavior: 'smooth' });
        } catch {
            alert('Erro ao cadastrar empresa!');
        }
    };

    const atualizarEmpresa = async (id, empresa) => {
        try {
            await fetch(`${url}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(empresa)
            });

            alert("Empresa atualizada com sucesso!");

            await buscarEmpresas();
            container.scrollIntoView({ behavior: 'smooth' });
        } catch {
            alert('Erro ao atualizar empresa!');
        }
    };

    const excluirEmpresa = async (id) => {
        try {
            await fetch(`${url}/${id}`, { method: 'DELETE' });

            alert("Empresa excluída com sucesso!");

            await buscarEmpresas();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            alert('Erro ao excluir empresa!');
        }
    };

    // =========================
    // Exibir empresas como cards
    // =========================
    const mostrarCards = () => {
        container.innerHTML = '';

        if (!empresas || empresas.length === 0) {
            container.innerHTML = `<p>Nenhuma empresa cadastrada.</p>`;
            return;
        }

        empresas.forEach(emp => {
            const card = document.createElement('div');
            card.className = 'card empresa-card';

            card.innerHTML = `
                <div class="card-body" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                    <div class="empresa-dados">
                        <p><strong>CNPJ:</strong> ${emp.cnpj}</p>
                        <p><strong>Razão Social:</strong> ${emp.razaoSocial || emp.razao_social || "—"}</p>
                        <p><strong>Nome Fantasia:</strong> ${emp.nomeFantasia || emp.nome_fantasia || "—"}</p>
                        <p><strong>Contato:</strong> ${emp.contato}</p>
                    </div>

                    <div class="card-actions" style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-warning btn-editar" data-id="${emp.id}">Editar</button>
                        <button class="btn btn-danger btn-excluir" data-id="${emp.id}">Excluir</button>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    };

    // =========================
    // Validação de campos
    // =========================
    const validarCampos = () => {
        const campos = [
            'cnpj', 'razao', 'fantasia',
            'inscEstadual', 'inscMunicipal',
            'endereco', 'contato', 'email'
        ];
        for (const campo of campos) {
            if (!document.getElementById(campo).value.trim()) {
                alert(`Por favor, preencha o campo ${campo}`);
                return false;
            }
        }
        return true;
    };

    // =========================
    // Verificar duplicidade
    // =========================
    const empresaDuplicada = (empresa) => {
        return empresas.some(e =>
            e.cnpj === empresa.cnpj && e.id !== empresa.id
        );
    };

    // =========================
    // Atualizar o botão mantendo o SVG
    // =========================
    const atualizarBotao = (texto) => {
        const svg = botao.querySelector('svg');
        botao.innerHTML = '';
        if (svg) botao.appendChild(svg);
        botao.insertAdjacentText('beforeend', ' ' + texto);
    };

    // =========================
    // Eventos
    // =========================
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!validarCampos()) return;

        const id = campoId.value;
        const empresa = {
            id: id || Date.now().toString(),
            cnpj: document.getElementById('cnpj').value,
            razaoSocial: document.getElementById('razao').value,
            nomeFantasia: document.getElementById('fantasia').value,
            inscricaoEstadual: document.getElementById('inscEstadual').value,
            inscricaoMunicipal: document.getElementById('inscMunicipal').value,
            endereco: document.getElementById('endereco').value,
            contato: document.getElementById('contato').value,
            email: document.getElementById('email').value
        };

        if (empresaDuplicada(empresa)) {
            alert('Já existe uma empresa cadastrada com este CNPJ!');
            return;
        }

        if (id) {
            await atualizarEmpresa(id, empresa);
        } else {
            await cadastrarEmpresa(empresa);
        }

        formulario.reset();
        campoId.value = '';
        atualizarBotao('Cadastrar');
        formulario.scrollIntoView({ behavior: 'smooth' });
    });

    container.addEventListener('click', async (event) => {
        const alvo = event.target;
        const id = alvo.dataset.id;

        if (alvo.classList.contains('btn-editar')) {
            const emp = empresas.find(e => e.id == id);
            if (emp) {
                campoId.value = emp.id;
                document.getElementById('cnpj').value = emp.cnpj;
                document.getElementById('razao').value = emp.razaoSocial || emp.razao_social;
                document.getElementById('fantasia').value = emp.nomeFantasia || emp.nome_fantasia;
                document.getElementById('inscEstadual').value = emp.inscricaoEstadual || emp.inscricao_estadual;
                document.getElementById('inscMunicipal').value = emp.inscricaoMunicipal || emp.inscricao_municipal;
                document.getElementById('endereco').value = emp.endereco;
                document.getElementById('contato').value = emp.contato;
                document.getElementById('email').value = emp.email;

                atualizarBotao('Atualizar');
                formulario.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (alvo.classList.contains('btn-excluir')) {
            if (confirm('Deseja realmente excluir esta empresa?')) {
                await excluirEmpresa(id);
            }
        }
    });

    // =========================
    // Inicializar
    // =========================
    buscarEmpresas();
});
