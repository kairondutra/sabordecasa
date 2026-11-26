// cardápio de exemplo, usado somente quando o banco ainda está vazio
import { inserirCategoria, listarCategorias } from "../repositories/categoriaRepository";
import { inserirPrato } from "../repositories/pratoRepository";

// cada prato: nome, preço, imagem e se está disponível (1) ou esgotado (0)
type PratoInicial = [string, number, string, number];

const cardapio: { categoria: string; descricao: string; pratos: PratoInicial[] }[] = [
  {
    categoria: "Pratos executivos",
    descricao: "Refeições completas para o dia a dia.",
    pratos: [
      ["Executivo de carne", 30.9, "prato7.jpg", 0],
      ["Executivo completo", 28.9, "prato8.jpg", 1],
      ["Arroz com vegetais", 23.9, "prato9.jpg", 1],
    ],
  },
  {
    categoria: "Carnes grelhadas",
    descricao: "Carnes preparadas na grelha.",
    pratos: [
      ["Bife grelhado", 29.9, "bife.jpg", 1],
      ["Bife acebolado", 31.9, "prato2.jpg", 1],
      ["Tiras de carne", 28.9, "prato3.jpg", 0],
      ["Carne com legumes", 27.9, "prato4.jpg", 1],
    ],
  },
  {
    categoria: "Frangos",
    descricao: "Opções preparadas com frango.",
    pratos: [
      ["Frango especial", 24.9, "frango.jpg", 1],
      ["Frango crocante", 26.9, "prato5.jpg", 1],
      ["Frango ao molho", 25.9, "prato6.jpg", 1],
      ["Frango crocante da casa", 27.9, "prato10.jpg", 0],
    ],
  },
];

export function inserirDadosIniciais() {
  if (listarCategorias().length > 0) return;

  cardapio.forEach(({ categoria, descricao, pratos }, posicao) => {
    const categoriaId = inserirCategoria({
      nome: categoria,
      descricao,
      ordem: posicao + 1,
      visivel: 1,
      imagem_url: `assets/images/${pratos[0][2]}`,
    });

    pratos.forEach(([nome, preco, imagem, disponivel]) => {
      inserirPrato({
        nome,
        descricao: null,
        preco,
        quantidade: disponivel ? 10 : 0,
        disponivel,
        imagem_url: `assets/images/${imagem}`,
        categoria_id: categoriaId,
      });
    });
  });
}
