import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  List,
  ListItem,
  Typography,
  Button,
  Drawer,
  Avatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import api from "../../hooks/ApiConect";

const RecipeUse = () => {
  const navigate = useNavigate();
  const emailUsuario = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const [menuAberto, setMenuAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const receitasPorPagina = 2;
  const [receitas, setReceitas] = useState<
    Array<{
      id: string;
      nome: string;
      ingredientes: { nome: string; quantidade: string }[];
      modoPreparo: string;
      tempoDeCozimento: number;
      imagens: string[];
    }>
  >([]);

  const toggleMenu =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if ("key" in event && (event.key === "Tab" || event.key === "Shift")) {
        return;
      }
      setMenuAberto(open);
    };

  useEffect(() => {
    const fetchReceitas = async () => {
      if (!emailUsuario) {
        alert("Email do usuário não encontrado. Faça login novamente.");
        navigate("/login");
      }

      try {
        if (!token) {
          alert("Token não encontrado. Faça login novamente.");
          navigate("/login");
        }

        const response = await api.get(
          `/receita/usuario?email=${encodeURIComponent(emailUsuario)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReceitas(response.data);
      } catch (error) {
        alert(
          "Erro ao carregar receitas. Verifique sua conexão e tente novamente."
        );
      }
    };

    fetchReceitas();
  }, [emailUsuario]); // Garante que o efeito só roda quando `emailUsuario` mudar

  const handleDelete = async (id: string) => {
    if (!emailUsuario) {
      console.warn("Email do usuário não encontrado no localStorage.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      await api.delete("/receita/deletar", {
        data: { nome: receitas.find((r) => r.id === id)?.nome, emailUsuario },
        headers: { Authorization: `Bearer ${token}` },
      });

      setReceitas(receitas.filter((r) => r.id !== id));
      alert("Receita excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir receita:", error);
      alert("Falha ao excluir receita. Tente novamente.");
    }
  };

  const indexInical = (paginaAtual - 1) * receitasPorPagina;
  const receitasPaginas = receitas.slice(
    indexInical,
    indexInical + receitasPorPagina
  );

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
            <AddIcon
              className="text-[#F0A04B]
          scale-150 "
            />
          </ListItemIcon>
          <ListItemText primary="Cadastro de Receita" />
        </ListItem>
        <ListItem onClick={() => navigate("/login")}>
          <ListItemIcon>
      
            <LoginIcon
              className="text-[#F0A04B]
          scale-150 "
            />{" "}
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem onClick={() => navigate("/recipe-edit")}>
          <ListItemIcon>
         
            <DeleteIcon className="text-[#F0A04B] scale-150 " />
          </ListItemIcon>
          <ListItemText primary="editar receitar" />
        </ListItem>
      </Drawer>

      {/*Receitas registradas do usuario*/}
      <List className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
        {receitas.length > 0 ? (
          receitasPaginas.map((receita) => (
            <ListItem
              key={receita.id}
              className="bg-[#E89253] shadow-lg p-6 w-full rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105 flex flex-col sm:flex-row items-center gap-4"
            >
              {receita.imagens.length > 0 && (
                <img
                  src={receita.imagens[0]}
                  alt={receita.nome}
                  className="w-42 h-42 sm:w-40 sm:h-40 object-cover rounded-xl shadow-md"
                />
              )}
              <div className="flex-1">
                <Typography
                  variant="h5"
                  className="font-bold text-lg text-gray-900"
                >
                  {receita.nome}
                </Typography>
                <Typography variant="body2" className="text-gray-700 mt-1">
                  Tempo de Cozimento:{" "}
                  <span className="font-semibold">
                    {receita.tempoDeCozimento} min
                  </span>
                </Typography>
                <Typography variant="body2" className="text-gray-700 mt-1">
                  Modo de preparo:{" "}
                  <span className="font-semibold">
                    {receita.modoPreparo} min
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-700 mt-1 font-semibold"
                >
                  Ingredientes:
                </Typography>
                <ul className="list-disc pl-5 text-gray-700 text-sm">
                  {receita.ingredientes.map((ing, index) => (
                    <li key={index}>
                      {ing.quantidade}x {ing.nome}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-2 mt-2 sm:mt-0">

                <IconButton onClick={() => handleDelete(receita.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </ListItem>
          ))
        ) : (
          <Typography className="text-center text-gray-500 text-4xl">
            Nenhuma receita encontrada.
          </Typography>
        )}
      </List>
      <Button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
      >
        Voltar
      </Button>

      {/* Paginação */}
      <div className="flex space-x-2 mt-4 ">
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
    </div>
  );
};

export default RecipeUse ;
