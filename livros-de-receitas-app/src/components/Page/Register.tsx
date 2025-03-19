import { useState } from "react";
import {
  TextField,
  Button,
  Avatar,
  Drawer,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import api from "../../hooks/ApiConect";

export default function Register() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const toggleMenu =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setMenuAberto(open);
    };

  // Função para registrar um novo usuário
  const handleRegister = () => {
    const data = { nome, email, senha };

    api
      .post("/usuario/registrar", data)
      .then(() => navigate("/login"))
      .catch((error) => {
        console.error("Erro ao registrar:", error);
        alert("Falha ao registrar. Verifique seus dados.");
      });
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
        <ListItem component="div" onClick={() => navigate("/")}>
          <ListItemIcon>
      
            <HomeIcon className="text-[#E89253]  scale-150" />{" "}
          </ListItemIcon>
          <ListItemText primary="Principal" />
        </ListItem>
        <ListItem component="div" onClick={() => navigate("/login")}>
          <ListItemIcon>
         
            <LoginIcon className="text-[#E89253]  scale-150" />{" "}
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem component="div" onClick={() => navigate("/recipe-user")}>
          <ListItemIcon>
            <DeleteIcon className=" text-[#E89253]  scale-150" />
          </ListItemIcon>
          <ListItemText primary="Deleta Receita" />
        </ListItem>
      </Drawer>

      <div className="w-full max-w-md p-10 bg-[#E89253]  rounded-4xl shadow-lg text-center">
        <Avatar
          className="mx-auto mb-6 border-3"
          sx={{ width: 56, height: 56 }}
        />
        <h1 className="text-5xl font-light mb-10">Registrar</h1>
        <div className="flex flex-col gap-3">
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            required={true}
            className="mb-4"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            required={true}
            fullWidth
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            required={true}
            variant="outlined"
            fullWidth
            className="mb-4"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 px-20 py-4">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mb-2"
            onClick={handleRegister}
          >
            Registrar
          </Button>
          <Button color="secondary" onClick={() => navigate("/login")}>
            Já tem uma conta? Faça login
          </Button>
        </div>
      </div>
    </div>
  );
}
