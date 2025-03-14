document.addEventListener("DOMContentLoaded", function () {
    // Adiciona o snippet do Google Tag Manager
    adicionarGoogleTagManager();

    carregarExcelAutomaticamente();
    adicionarBotaoWhatsApp(); // Chama a função para adicionar o botão do WhatsApp
});

function adicionarGoogleTagManager() {
    const gtmScript = document.createElement("script");
    gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NGQWX2NM');
    `;
    document.head.appendChild(gtmScript);

    // Adiciona o iframe do GTM (parte do snippet que vai no <body>)
    const gtmIframe = document.createElement("noscript");
    gtmIframe.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NGQWX2NM"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.insertBefore(gtmIframe, document.body.firstChild);
}

function carregarExcelAutomaticamente() {
    const caminhoDoArquivo = "catalogo_produtos.xlsx"; // Caminho relativo ao arquivo Excel

    fetch(caminhoDoArquivo)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Arquivo não encontrado ou erro na rede");
            }
            return response.arrayBuffer();
        })
        .then((data) => {
            const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const produtos = XLSX.utils.sheet_to_json(sheet);
            exibirProdutosPorDepartamento(produtos);
        })
        .catch((error) => {
            console.error("Erro ao carregar o arquivo Excel:", error);
        });
}

function exibirProdutosPorDepartamento(produtos) {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = ""; // Limpa antes de adicionar novos produtos

    // Agrupa produtos por departamento
    const produtosPorDepartamento = produtos.reduce((acc, produto) => {
        const departamento = produto.Departamento || "Outros";
        if (!acc[departamento]) {
            acc[departamento] = [];
        }
        acc[departamento].push(produto);
        return acc;
    }, {});

    // Exibe os produtos por departamento
    for (const [departamento, produtos] of Object.entries(produtosPorDepartamento)) {
        const divDepartamento = document.createElement("div");
        divDepartamento.classList.add("departamento");

        const tituloDepartamento = document.createElement("h2");
        tituloDepartamento.textContent = departamento;
        divDepartamento.appendChild(tituloDepartamento);

        const divProdutos = document.createElement("div");
        divProdutos.classList.add("produtos-container");

        produtos.forEach((produto) => {
            const divProduto = document.createElement("div");
            divProduto.classList.add("produto");
            divProduto.innerHTML = `
                <img src="imagens/${produto.Imagem}" alt="${produto.Nome}">
                <h3>${produto.Nome}</h3>
                `;
            divProdutos.appendChild(divProduto);
        });

        divDepartamento.appendChild(divProdutos);
        catalogo.appendChild(divDepartamento);
    }
}

function adicionarBotaoWhatsApp() {
    setTimeout(function () {
        // Adiciona o CSS para o botão do WhatsApp
        const css = `
            .gen123 {
                position: fixed;
                width: 4em;
                height: 4em;
                z-index: 100;
            }
            .gen123 svg {
                width: 100%;
                height: 100%;
            }
            .gen123.top {
                top: 5em;
            }
            .gen123.bottom {
                bottom: 5em;
            }
            .gen123.left {
                left: 3em;
            }
            .gen123.right {
                right: 3em;
            }
        `;
        const style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        // Cria o link do WhatsApp
        const linkWhatsApp = document.createElement("a");
        linkWhatsApp.href = "https://wa.me/31972132922"; // Substitua pelo seu número de WhatsApp
        linkWhatsApp.target = "_blank";
        linkWhatsApp.className = "gen123 bottom right";

        // Adiciona o ícone do WhatsApp ao link
        const svgWhatsApp = `
            <svg enable-background="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg">
                <path d="m20.52 3.449c-2.28-2.204-5.28-3.449-8.475-3.449-9.17 0-14.928 9.935-10.349 17.838l-1.696 6.162 6.335-1.652c2.76 1.491 5.021 1.359 5.716 1.447 10.633 0 15.926-12.864 8.454-20.307z" fill="#eceff1"/>
                <path d="m12.067 21.751-.006-.001h-.016c-3.182 0-5.215-1.507-5.415-1.594l-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-8.793 10.745-13.19 16.963-6.975 6.203 6.15 1.848 16.875-7.026 16.875z" fill="#4caf50"/>
                <path d="m17.507 14.307-.009.075c-.301-.15-1.767-.867-2.04-.966-.613-.227-.44-.036-1.617 1.312-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.293-.506.32-.578.878-1.634.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.576-.05-.997-.042-1.368.344-1.614 1.774-1.207 3.604.174 5.55 2.714 3.552 4.16 4.206 6.804 5.114.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z" fill="#fafafa"/>
            </svg>
        `;
        linkWhatsApp.innerHTML = svgWhatsApp;

        // Adiciona o link ao corpo do documento
        document.body.appendChild(linkWhatsApp);
    }, 2000); // Aguarda 2 segundos antes de adicionar o botão
}