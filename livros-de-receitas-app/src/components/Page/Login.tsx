import { useState } from "react";
import {
  Avatar,
  IconButton,
  Drawer,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import api from "../../hooks/ApiConect";

export default function LoginPage() {
  const [menuAberto, setMenuAberto] = useState(false);
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

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = { email, senha };

    try {
      const response = await api.post("/usuario/login", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("nome", response.data.nome);

      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Falha ao fazer login. Verifique suas credenciais.");
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
          
            <DeleteIcon className="text-[#E89253]  scale-150" />{" "}
          </ListItemIcon>
          <ListItemText primary="Deleta Receita" />
        </ListItem>
      </Drawer>

      <div className="w-full max-w-md p-10 bg-[#E89253] rounded-4xl shadow-lg text-center">
        <Avatar
          className="mx-auto mb-6 border-3"
          sx={{ width: 80, height: 80 }}
        />
        <h1 className="text-5xl font-light mb-10">Login</h1>
        <div className="flex flex-col gap-3">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            className="mb-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            variant="outlined"
            fullWidth
            className="mb-6"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 px-20 py-4  ">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/register")}
          >
            Registrar
          </Button>
        </div>
      </div>
    </div>
  );
}
