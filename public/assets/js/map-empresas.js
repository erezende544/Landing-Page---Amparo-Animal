// Ponto padrão: Belo Horizonte central
const centralLatLong = [-43.9397233, -19.9332786];

let map;

// Lista das ONGs com latitude/longitude adicionadas manualmente
const locais = [
    {
        id: 1,
        descricao: "Matilha Real",
        endereco: "Rua Catete, 640, Alto Barroca Belo Horizonte - MG",
        cidade: "Belo Horizonte",
        latlong: [-43.965937, -19.932071],
        cor: "red"
    },
    {
        id: 2,
        descricao: "Cães e Amigos",
        endereco: "R. Padre Silveira Lôbo, 487 - Aeroporto, Belo Horizonte - MG",
        cidade: "Belo Horizonte",
        latlong: [-43.942998, -19.828751],
        cor: "blue"
    },
    {
        id: 3,
        descricao: "Adimax Rações",
        endereco: "Av. José Carlos Costa, 300 - Liberdade, Ribeirão das Neves - MG",
        cidade: "Ribeirão das Neves",
        latlong: [-44.022829, -19.756727],
        cor: "green"
    },
    {
        id: 4,
        descricao: "Cão Viver",
        endereco: "Rua Primeiro de Maio, 165, Bairro Vila Boa Vista, Contagem - MG",
        cidade: "Contagem",
        latlong: [-44.071278, -19.935704],
        cor: "orange"
    }
];

window.onload = () => {
    // Pega o ID da ONG enviada pela URL (map.html?id=1)
    const params = new URLSearchParams(window.location.search);
    const ongId = parseInt(params.get("id"));

    // Encontra a ONG no array
    const ong = locais.find(l => l.id === ongId);

    montarMapa(ong);
}

function montarMapa(local) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9tbWVsY2FybmVpcm8tcHVjIiwiYSI6ImNsb3ZuMTBoejBsd2gyamwzeDZzcWl5b3oifQ.VPWc3qoyon8Z_-URfKpvKg';

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: local ? local.latlong : centralLatLong,
        zoom: local ? 15 : 11
    });

    if (local) {
        let popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
                <h3>${local.descricao}</h3>
                ${local.endereco} <br>
                ${local.cidade}
            `);

        new mapboxgl.Marker({ color: local.cor })
            .setLngLat(local.latlong)
            .setPopup(popup)
            .addTo(map);
    }
}
