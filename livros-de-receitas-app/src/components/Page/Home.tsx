import { useState, useEffect } from "react";
import {
  Avatar,
  IconButton,
  Drawer,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogContent,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import api from "../../hooks/ApiConect";

interface Ingrediente {
  id: string;
  nome: string;
  quantidade: string;
}

interface Receita {
  id: string;
  nome: string;
  ingredientes: Ingrediente[];
  tempoDeCozimento: number;
  rendimento: number;
  nivelDificuldade: string;
  modoPreparo: string;
  estrelas: number;
  imagens: string[];
}

export default function Home() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const receitasPorPagina = 3;
  const [menuAberto, setMenuAberto] = useState(false);
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const [receitaDetalhada, setReceitaDetalhada] = useState<Receita | null>(
    null
  );
  const [imagemIndex, setImagemIndex] = useState<number>(0); 
  const [avaliacao, setAvaliacao] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let isMontando = true;

    const carregarReceitas = async () => {
      try {
        const response = await api.get("/receita/todas");
        if (isMontando) {
          setReceitas(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
      }
    };

    carregarReceitas();

    return () => {
      isMontando = false;
    };
  }, []);

  const toggleMenu =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if ("key" in event && (event.key === "Tab" || event.key === "Shift")) {
        return;
      }
      setMenuAberto(open);
    };

  const abrirDetalhes = (receita: Receita) => {
    setReceitaDetalhada(receita);
    setAvaliacao(null);
    setDetalhesAbertos(true);
  };

  const indexInical = (paginaAtual - 1) * receitasPorPagina;
  const receitasPaginas = receitas.slice(
    indexInical,
    indexInical + receitasPorPagina
  );

  const avaliarReceita = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para avaliar uma receita.");
      navigate("/login");
    }
    try {
      await api.put(
        "/receita/avaliar",
        {
          id: receitaDetalhada?.id,
          nome: receitaDetalhada?.nome,
          estrelas: avaliacao,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Avaliação enviada com sucesso!");
      setDetalhesAbertos(false);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação. Tente novamente.");
    }
  };

  const irParaProximaImagem = () => {
    if (receitaDetalhada) {
      setImagemIndex((prevIndex) =>
        (prevIndex + 1) % receitaDetalhada.imagens.length
      );
    }
  };

  const irParaImagemAnterior = () => {
    if (receitaDetalhada) {
      setImagemIndex(
        (prevIndex) =>
          (prevIndex - 1 + receitaDetalhada.imagens.length) %
          receitaDetalhada.imagens.length
      );
    }
  };
  

  return (
    <div className="flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-5 min-h-screen bg-[#FCE7C8]">
      {/* Cabeçalho */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4 p-4 shadow-md bg-[#B1C29E] rounded-lg">
        <IconButton onClick={toggleMenu(true)}>
          <MenuIcon className="border-2" />
        </IconButton>
        <h1 className="text-xl font-bold">Livros de Receitas</h1>
        <Avatar className="border-3" sx={{ width: 64, height: 64 }} />
      </div>

      {/* Menu Lateral */}
      <Drawer
        anchor="left"
        open={menuAberto}
        onClose={toggleMenu(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#FCE7C8",
            color: "black",
            font: "initial",
          },
        }}
      >
        <ListItem onClick={() => navigate("/register-revenue")}>
          <ListItemIcon>
         
            <AddIcon className="text-[#E89253] scale-150 " />{" "}
          </ListItemIcon>
          <ListItemText primary="Cadastrar de Receita" />
        </ListItem>
        <ListItem component="div" onClick={() => navigate("/login")}>
          <ListItemIcon>
            <LoginIcon className="text-[#E89253] scale-150" />{" "}
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem component="div" onClick={() => navigate("/recipe-user")}>
          <ListItemIcon>
            <DeleteIcon className="text-[#E89253] scale-150" />{" "}
          </ListItemIcon>
          <ListItemText primary=" Deletar receitar" />
        </ListItem>
      </Drawer>

      {/* Lista de Receitas */}
      <div className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto ">
        {receitasPaginas.map((receita) => (
          <div
            key={receita.id}
            className="bg-[#E89253] shadow-lg p-4 w-full sm:w-3/4 md:w-1/2 rounded-lg cursor-pointer transition delay-150 duration-300 ease-in-out transform hover:scale-105 "
            onClick={() => abrirDetalhes(receita)}
          >
            <img
              src={receita.imagens[0]}
              alt={receita.nome}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover mr-4"
            />
            <div className="flex-1">
              <h2 className="text-2xl">{receita.nome}</h2>
              <p>Dificuldade:{receita.nivelDificuldade} </p>
              <div className="flex items-center">
                {/* Exibe a média de estrelas com no máximo 5 ícones preenchidos */}
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={
                      index < Math.round(receita.estrelas)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
                {/* Exibe o valor numérico da média */}
                <span className="ml-2 text-gray-700 text-sm">
                  ({receita.estrelas.toFixed(1)})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex space-x-2 mt-4  ">
        {[...Array(Math.ceil(receitas.length / receitasPorPagina))].map(
          (_, index) => (
            <Button
              key={index}
              variant={paginaAtual === index + 1 ? "contained" : "outlined"}
              onClick={() => setPaginaAtual(index + 1)}
            >
              {index + 1}
            </Button>
          )
        )}
      </div>
      {/* Detalhes da Receita */}
      <Dialog open={detalhesAbertos} onClose={() => setDetalhesAbertos(false)}>
        {receitaDetalhada && (
          <>
            <h1 className="text-4xl text-center bg-[#E89253]  border-2   ">
              {receitaDetalhada.nome}
            </h1>

            <DialogContent className="bg-[#FCE7C8] text-black p-4 ">
            <div className="relative mt-1 pb-5 text-2xl space-x-3">
                <button
                  onClick={irParaImagemAnterior}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                >
                  &lt;
                </button>
                <img
                  src={receitaDetalhada.imagens[imagemIndex]}
                  alt={`Imagem ${imagemIndex + 1}`}
                  className="w-60 h-60 rounded-4xl border-2 object-cover"
                  onClick={irParaProximaImagem}
                />
                <button
                  onClick={irParaProximaImagem}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                >
                  &gt;
                </button>
              </div>
              <div className="flex flex-col space-y-2 text-lg">
                <p>
                  <strong>Tempo de Cozimento:</strong>{" "}
                  {receitaDetalhada.tempoDeCozimento} minutos
                </p>
                <p>
                  <strong>Rendimento:</strong> {receitaDetalhada.rendimento}{" "}
                  porções
                </p>
                <p>
                  <strong>Nível de Dificuldade:</strong>{" "}
                  {receitaDetalhada.nivelDificuldade}
                </p>
                <p>
                  <strong>Estrelas:</strong> {receitaDetalhada.estrelas}
                </p>
                <p>
                  <strong>
                    Modo de Preparo:{receitaDetalhada.modoPreparo}{" "}
                  </strong>
                </p>
                <p>
                  <strong>Ingredientes:</strong>
                </p>
                <ul>
                  {receitaDetalhada.ingredientes.map((ing, index) => (
                    <li key={index}>
                      {ing.quantidade} x {ing.nome}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <p>Avalie esta receita:</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <IconButton key={num} onClick={() => setAvaliacao(num)}>
                        <StarIcon
                          className={
                            avaliacao && num <= avaliacao
                              ? "text-yellow-500"
                              : "text-gray-400"
                          }
                        />
                      </IconButton>
                    ))}
                  </div>
                  <Button onClick={avaliarReceita} className="ml-2">
                    Enviar Avaliação
                  </Button>
                </div>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}
