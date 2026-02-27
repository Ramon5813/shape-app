// =====================================
// CONFIGURAÇÃO PESO
// =====================================

const pesoInicial = 89;
const metaCutting = 82;
const metaBulking = 95;

// =====================================
// INICIALIZAÇÃO GLOBAL
// =====================================

window.onload = function () {
    configurarPeso();
    configurarReceitas();
    configurarBuscaEFiltro();
    carregarReceitas();
    atualizarProgresso();
};

// =====================================
// ================= PESO (INDEX)
// =====================================

function configurarPeso() {

    const btnSalvar = document.getElementById("salvarPeso");
    const btnModo = document.getElementById("btnModo");

    if (btnSalvar) btnSalvar.addEventListener("click", salvarPeso);
    if (btnModo) btnModo.addEventListener("click", alternarModo);
}

function salvarPeso() {

    const input = document.getElementById("inputPeso");
    if (!input) return;

    const peso = parseFloat(input.value);
    if (!peso) return;

    localStorage.setItem("pesoAtual", peso);
    input.value = "";

    atualizarProgresso();
}

function alternarModo() {

    let modo = localStorage.getItem("modo") || "cutting";
    modo = modo === "cutting" ? "bulking" : "cutting";

    localStorage.setItem("modo", modo);
    atualizarProgresso();
}

function atualizarProgresso() {

    const pesoElemento = document.getElementById("pesoAtual");
    const barra = document.getElementById("barraProgresso");
    const diferencaElemento = document.getElementById("diferencaPeso");
    const btnModo = document.getElementById("btnModo");

    if (!pesoElemento || !barra) return;

    const pesoAtual = parseFloat(localStorage.getItem("pesoAtual"));
    if (!pesoAtual) return;

    const modo = localStorage.getItem("modo") || "cutting";
    const meta = modo === "cutting" ? metaCutting : metaBulking;

    if (btnModo) {
        btnModo.innerText =
            modo === "cutting"
                ? "Modo: Cutting 🔥"
                : "Modo: Bulking 💪";
    }

    pesoElemento.innerText = "Peso Atual: " + pesoAtual + " kg";

    const diferenca = pesoAtual - pesoInicial;

    if (diferencaElemento) {
        if (diferenca < 0) {
            diferencaElemento.innerText = diferenca.toFixed(1) + " kg 🔽";
            diferencaElemento.style.color = "limegreen";
        } else if (diferenca > 0) {
            diferencaElemento.innerText = "+" + diferenca.toFixed(1) + " kg 🔼";
            diferencaElemento.style.color = "red";
        } else {
            diferencaElemento.innerText = "Sem alteração";
            diferencaElemento.style.color = "white";
        }
    }

    let progresso;

    if (modo === "cutting") {
        progresso = ((pesoInicial - pesoAtual) / (pesoInicial - meta)) * 100;
    } else {
        progresso = ((pesoAtual - pesoInicial) / (meta - pesoInicial)) * 100;
    }

    progresso = Math.max(0, Math.min(100, progresso));
    barra.style.width = progresso + "%";

    if (
        (modo === "cutting" && diferenca < 0) ||
        (modo === "bulking" && diferenca > 0)
    ) {
        barra.style.backgroundColor = "limegreen";
    } else {
        barra.style.backgroundColor = "red";
    }
}

// =====================================
// ================= RECEITAS
// =====================================

function configurarReceitas() {

    const form = document.getElementById("formReceita");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const receitas = JSON.parse(localStorage.getItem("receitas")) || [];

        const nome = document.getElementById("nome").value;
        const categoria = document.getElementById("categoria").value;
        const ingredientes = document.getElementById("ingredientes").value;
        const editIndex = document.getElementById("editIndex").value;

        const novaReceita = { nome, categoria, ingredientes };

        if (editIndex === "") {
            receitas.push(novaReceita);
        } else {
            receitas[editIndex] = novaReceita;
        }

        localStorage.setItem("receitas", JSON.stringify(receitas));

        form.reset();
        document.getElementById("editIndex").value = "";

        carregarReceitas();
    });
}

function configurarBuscaEFiltro() {

    const busca = document.getElementById("busca");
    const filtro = document.getElementById("filtroCategoria");

    if (busca) busca.addEventListener("input", carregarReceitas);
    if (filtro) filtro.addEventListener("change", carregarReceitas);
}

function carregarReceitas() {

    const lista = document.getElementById("lista-receitas");
    if (!lista) return;

    const buscaValor = document.getElementById("busca")?.value.toLowerCase() || "";
    const filtroValor = document.getElementById("filtroCategoria")?.value || "todas";

    const receitas = JSON.parse(localStorage.getItem("receitas")) || [];

    lista.innerHTML = "";

    receitas.forEach(function (receita, index) {

        if (!receita.nome.toLowerCase().includes(buscaValor)) return;
        if (filtroValor !== "todas" && receita.categoria !== filtroValor) return;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${receita.nome}</h3>
            <p><strong>${receita.categoria}</strong></p>
            <p style="white-space: pre-line;">${receita.ingredientes}</p>
            <button onclick="editarReceita(${index})">Editar</button>
            <button onclick="apagarReceita(${index})">Apagar</button>
        `;

        lista.appendChild(card);
    });
}

function editarReceita(index) {

    const receitas = JSON.parse(localStorage.getItem("receitas")) || [];
    const receita = receitas[index];

    document.getElementById("nome").value = receita.nome;
    document.getElementById("categoria").value = receita.categoria;
    document.getElementById("ingredientes").value = receita.ingredientes;
    document.getElementById("editIndex").value = index;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function apagarReceita(index) {

    const receitas = JSON.parse(localStorage.getItem("receitas")) || [];
    receitas.splice(index, 1);

    localStorage.setItem("receitas", JSON.stringify(receitas));
    carregarReceitas();
}
// =====================================
// ================= MEDIDAS CORPORAIS
// =====================================

window.addEventListener("load", configurarMedidas);

function configurarMedidas() {

    const form = document.getElementById("formMedidas");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const medidas = JSON.parse(localStorage.getItem("medidas")) || [];

        const data = document.getElementById("data").value;
        const cintura = document.getElementById("cintura").value;
        const peito = document.getElementById("peito").value;
        const braco = document.getElementById("braco").value;
        const perna = document.getElementById("perna").value;
        const editIndex = document.getElementById("editIndexMedida").value;

        const novaMedida = {
            data,
            cintura,
            peito,
            braco,
            perna
        };

        if (editIndex === "") {
            medidas.push(novaMedida);
        } else {
            medidas[editIndex] = novaMedida;
        }

        localStorage.setItem("medidas", JSON.stringify(medidas));

        form.reset();
        document.getElementById("editIndexMedida").value = "";

        carregarMedidas();
    });

    carregarMedidas();
}

function carregarMedidas() {

    const lista = document.getElementById("lista-medidas");
    if (!lista) return;

    const medidas = JSON.parse(localStorage.getItem("medidas")) || [];

    lista.innerHTML = "";

    medidas.forEach(function (medida, index) {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${medida.data}</h3>
            <p>Cintura: ${medida.cintura || "-"} cm</p>
            <p>Peito: ${medida.peito || "-"} cm</p>
            <p>Braço: ${medida.braco || "-"} cm</p>
            <p>Perna: ${medida.perna || "-"} cm</p>
            <button onclick="editarMedida(${index})">Editar</button>
            <button onclick="apagarMedida(${index})">Apagar</button>
        `;

        lista.appendChild(card);
    });
}

function editarMedida(index) {

    const medidas = JSON.parse(localStorage.getItem("medidas")) || [];
    const medida = medidas[index];

    document.getElementById("data").value = medida.data;
    document.getElementById("cintura").value = medida.cintura;
    document.getElementById("peito").value = medida.peito;
    document.getElementById("braco").value = medida.braco;
    document.getElementById("perna").value = medida.perna;
    document.getElementById("editIndexMedida").value = index;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function apagarMedida(index) {

    const medidas = JSON.parse(localStorage.getItem("medidas")) || [];
    medidas.splice(index, 1);

    localStorage.setItem("medidas", JSON.stringify(medidas));
    carregarMedidas();
}

