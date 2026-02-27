// =====================================
// INICIALIZAÇÃO
// =====================================

window.onload = function () {
    configurarReceitas();
    configurarBuscaEFiltro();
    carregarReceitas();
};

// =====================================
// CONFIGURAR FORMULÁRIO
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

        const novaReceita = {
            nome: nome,
            categoria: categoria,
            ingredientes: ingredientes
        };

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

// =====================================
// BUSCA E FILTRO
// =====================================

function configurarBuscaEFiltro() {

    const busca = document.getElementById("busca");
    const filtro = document.getElementById("filtroCategoria");

    if (busca) {
        busca.addEventListener("input", carregarReceitas);
    }

    if (filtro) {
        filtro.addEventListener("change", carregarReceitas);
    }
}

// =====================================
// CARREGAR RECEITAS
// =====================================

function carregarReceitas() {

    const lista = document.getElementById("lista-receitas");
    if (!lista) return;

    const buscaValor = document.getElementById("busca")?.value.toLowerCase() || "";
    const filtroValor = document.getElementById("filtroCategoria")?.value || "todas";

    const receitas = JSON.parse(localStorage.getItem("receitas")) || [];

    lista.innerHTML = "";

    receitas.forEach(function (receita, index) {

        const nomeLower = receita.nome.toLowerCase();

        // FILTRO POR BUSCA
        if (!nomeLower.includes(buscaValor)) return;

        // FILTRO POR CATEGORIA
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

// =====================================
// EDITAR
// =====================================

function editarReceita(index) {

    const receitas = JSON.parse(localStorage.getItem("receitas")) || [];
    const receita = receitas[index];

    document.getElementById("nome").value = receita.nome;
    document.getElementById("categoria").value = receita.categoria;
    document.getElementById("ingredientes").value = receita.ingredientes;
    document.getElementById("editIndex").value = index;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// =====================================
// APAGAR
// =====================================

function apagarReceita(index) {

    const receitas = JSON.parse(localStorage.getItem("receitas")) || [];

    receitas.splice(index, 1);

    localStorage.setItem("receitas", JSON.stringify(receitas));

    carregarReceitas();
}