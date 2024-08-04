document.addEventListener('DOMContentLoaded', () => {
    const formularioCadastro = document.getElementById('formulario');
    const formularioBusca = document.getElementById('formulario_busca');
    const resultadoLista = document.getElementById('resultado-lista');
    const mensagemNenhumResultado = document.createElement('p');
    const mensagemSemLivros = document.createElement('p');

    // Configura a mensagem de nenhum resultado
    mensagemNenhumResultado.id = 'nenhum-resultado';
    mensagemNenhumResultado.textContent = 'Nenhum livro encontrado.';
    mensagemNenhumResultado.style.display = 'none'; // Inicialmente oculto
    resultadoLista.appendChild(mensagemNenhumResultado);

    // Configura a mensagem de nenhum livro cadastrado
    mensagemSemLivros.id = 'sem-livros';
    mensagemSemLivros.textContent = 'Nenhum livro cadastrado.';
    resultadoLista.appendChild(mensagemSemLivros);

    // Função para criar um novo elemento livro
    function criarElementoLivro(titulo, autor, genero, ano, paginas, classificacao) {
        const livroDiv = document.createElement('div');
        livroDiv.className = 'livro';
        livroDiv.innerHTML = `
            <h3>${titulo}</h3>
            <p><strong>Autor:</strong> ${autor}</p>
            <p><strong>Gênero:</strong> ${genero}</p>
            <p><strong>Ano:</strong> ${ano}</p>
            <p><strong>Páginas:</strong> ${paginas}</p>
            <p><strong>Classificação:</strong> ${classificacao}</p>
        `;
        resultadoLista.appendChild(livroDiv);
    }

    // Função para salvar livros no localStorage
    function salvarLivrosNoLocalStorage(livros) {
        localStorage.setItem('livros', JSON.stringify(livros));
    }

    // Função para carregar livros do localStorage
    function carregarLivrosDoLocalStorage() {
        const livros = JSON.parse(localStorage.getItem('livros')) || [];
        if (livros.length === 0) {
            mensagemSemLivros.style.display = 'block'; // Exibe a mensagem de nenhum livro cadastrado
        } else {
            mensagemSemLivros.style.display = 'none'; // Oculta a mensagem de nenhum livro cadastrado
            livros.forEach(livro => criarElementoLivro(livro.titulo, livro.autor, livro.genero, livro.ano, livro.paginas, livro.classificacao));
        }
    }

    // Carrega livros do localStorage ao carregar a página
    carregarLivrosDoLocalStorage();

    // Função para adicionar um livro ao cadastro
    formularioCadastro.addEventListener('submit', (e) => {
        e.preventDefault();
        const titulo = document.getElementById('title').value;
        const autor = document.getElementById('autor').value;
        const genero = document.getElementById('genero').value;
        const ano = document.getElementById('age').value;
        const paginas = document.getElementById('pages').value;
        const classificacao = document.getElementById('idade').value;

        // Adiciona livro ao DOM
        criarElementoLivro(titulo, autor, genero, ano, paginas, classificacao);

        // Adiciona livro ao localStorage
        const livros = JSON.parse(localStorage.getItem('livros')) || [];
        livros.push({ titulo, autor, genero, ano, paginas, classificacao });
        salvarLivrosNoLocalStorage(livros);

        formularioCadastro.reset();
        mensagemSemLivros.style.display = 'none'; // Oculta a mensagem de nenhum livro cadastrado ao adicionar um livro
    });

    // Função para pesquisar livros
    formularioBusca.addEventListener('submit', (e) => {
        e.preventDefault();
        const criterio = document.getElementById('criterio_busca').value;
        const pesquisa = document.getElementById('pesquisar').value.toLowerCase();
        const livros = Array.from(document.querySelectorAll('.livro'));
        let encontrou = false;

        if (livros.length === 0) {
            mensagemNenhumResultado.style.display = 'none'; // Oculta a mensagem de nenhum resultado se não houver livros
            mensagemSemLivros.style.display = 'block'; // Exibe a mensagem de nenhum livro cadastrado
            return;
        }

        livros.forEach(livro => {
            const texto = livro.textContent.toLowerCase();
            if (texto.includes(pesquisa)) {
                livro.style.opacity = '0'; // Começa com opacidade 0 para animação
                livro.style.display = 'block';
                livro.offsetHeight; // Força uma reflow para reiniciar a animação
                livro.style.transition = 'opacity 0.5s ease-in'; // Define a transição
                livro.style.opacity = '1'; // Transição para visível
                encontrou = true;
            } else {
                livro.style.transition = 'opacity 0.5s ease-out'; // Define a transição para ocultar
                livro.style.opacity = '0'; // Oculta com animação
                setTimeout(() => livro.style.display = 'none', 500); // Oculta completamente após a animação
            }
        });

        // Mostra ou oculta a mensagem de nenhum resultado
        mensagemNenhumResultado.style.display = encontrou ? 'none' : 'block';
    });

    // Adiciona funcionalidade para enviar formulário com Enter
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });
    });
});
