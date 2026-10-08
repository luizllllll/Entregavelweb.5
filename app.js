
// PARTE 1 - PEDIDOS

let pedidos = [
    {cliente: "Ana", valor: 120, status: "pago"},
    {cliente: "Bruno", valor: 80, status: "pendente"},
    {cliente: "", valor: 50, status: "pago"},
    {cliente: "Carlos", valor: -20, status: "pago"},
    {cliente: "Daniela", valor: 200, status: "pago"}
];

let botaoPedidos = document.querySelector("#botaoPedidos");
let resultadoPedidos = document.querySelector("#resultadoPedidos");

botaoPedidos.addEventListener("click", function() {

    // Validar os pedidos
    let validos = pedidos.filter(function(pedido) {
        return pedido.cliente.trim() !== "" &&
               typeof pedido.valor === "number" &&
               pedido.valor > 0;
    });

    // Filtrar apenas os pagos
    let pagos = validos.filter(function(pedido) {
        return pedido.status === "pago";
    });

    // Somar os valores
    let total = pagos.reduce(function(soma, pedido) {
        return soma + pedido.valor;
    }, 0);

    let mensagem = `Total faturado: R$ ${total.toFixed(2)}`;

    resultadoPedidos.textContent = mensagem;

    console.log("Pedidos válidos:", validos);
    console.log("Pedidos pagos:", pagos);
    console.log(mensagem);
});


// PARTE 2 - BUSCADOR DE CEP

let formCep = document.querySelector("#formCep");
let campoCep = document.querySelector("#cep");
let botaoCep = document.querySelector("#botaoCep");
let statusCep = document.querySelector("#statusCep");
let resultadoCep = document.querySelector("#resultadoCep");
let listaHistorico = document.querySelector("#historico");

let historico = [];

formCep.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    let cep = campoCep.value.trim();

    // Remover pontos e traços
    cep = cep.replace(/\D/g, "");

    // Validar o CEP
    if (!/^\d{8}$/.test(cep)) {
        statusCep.textContent = "CEP inválido";
        resultadoCep.replaceChildren();
        return;
    }

    // Carregando
    statusCep.textContent = "Buscando...";
    botaoCep.disabled = true;
    resultadoCep.replaceChildren();

    try {
        let resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        if (!resposta.ok) {
            throw new Error("Erro na consulta");
        }

        let dados = await resposta.json();

        // CEP não encontrado
        if (dados.erro === true) {
            statusCep.textContent = "CEP não encontrado";
            return;
        }

        // Limpar o resultado anterior
        resultadoCep.replaceChildren();

        // Criar elementos
        let endereco = document.createElement("div");

        let cepTexto = document.createElement("p");
        cepTexto.textContent = "CEP: " + dados.cep;

        let rua = document.createElement("p");
        rua.textContent = "Rua: " + dados.logradouro;

        let bairro = document.createElement("p");
        bairro.textContent = "Bairro: " + dados.bairro;

        let cidade = document.createElement("p");
        cidade.textContent = "Cidade: " + dados.localidade;

        let uf = document.createElement("p");
        uf.textContent = "UF: " + dados.uf;

        endereco.append(cepTexto, rua, bairro, cidade, uf);

        resultadoCep.append(endereco);

        statusCep.textContent = "";

        // Guardar histórico
        historico.push({
            cep: dados.cep,
            cidade: dados.localidade,
            uf: dados.uf
        });

        // Mostrar histórico
        listaHistorico.replaceChildren();

        historico.forEach(function(item) {
            let li = document.createElement("li");

            li.textContent =
                item.cep + " - " + item.cidade + "/" + item.uf;

            listaHistorico.append(li);
        });

    } catch (erro) {
        statusCep.textContent =
            "Falha na conexão. Tente novamente.";

        console.log(erro);

    } finally {
        botaoCep.disabled = false;
    }
});


// PARTE 3 - MINI POKÉDEX

let formPokemon = document.querySelector("#formPokemon");
let campoPokemon = document.querySelector("#pokemon");
let botaoPokemon = document.querySelector("#botaoPokemon");
let statusPokemon = document.querySelector("#statusPokemon");
let resultadoPokemon = document.querySelector("#resultadoPokemon");

formPokemon.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    let nome = campoPokemon.value.trim().toLowerCase();

    // Validar nome
    if (nome === "") {
        statusPokemon.textContent = "Digite um Pokémon";
        resultadoPokemon.replaceChildren();
        return;
    }

    // Carregando
    statusPokemon.textContent = "Buscando...";
    botaoPokemon.disabled = true;
    resultadoPokemon.replaceChildren();

    try {
        let resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nome)}`
        );

        // Pokémon não encontrado
        if (resposta.status === 404) {
            statusPokemon.textContent = "Pokémon não encontrado";
            return;
        }

        if (!resposta.ok) {
            throw new Error("Erro na consulta");
        }

        let dados = await resposta.json();

        // Mostrar nome
        let titulo = document.createElement("h3");
        titulo.textContent = dados.name;

        // Mostrar imagem
        let imagem = document.createElement("img");
        imagem.src = dados.sprites.front_default;
        imagem.alt = dados.name;

        // Mostrar tipos
        let tipos = document.createElement("p");

        let nomesTipos = dados.types.map(function(item) {
            return item.type.name;
        });

        tipos.textContent = "Tipos: " + nomesTipos.join(", ");

        resultadoPokemon.append(titulo);

        if (dados.sprites.front_default !== null) {
            resultadoPokemon.append(imagem);
        }

        resultadoPokemon.append(tipos);

        statusPokemon.textContent = "";

    } catch (erro) {
        statusPokemon.textContent =
            "Falha na conexão. Tente novamente.";

        console.log(erro);

    } finally {
        botaoPokemon.disabled = false;
    }
});