import {
  IconButton,
  Avatar,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../hooks/ApiConect";

interface Ingrediente {
  nome: string;
  quantidade: string;
}

interface Receita {
  nome: string;
  ingredientes: Ingrediente[];
  tempoDeCozimento: number;
  rendimento: number;
  nivelDificuldade: string;
  modoPreparo: string;
  imagens: string[];
  emailUsuario: string;
}

const schema = yup.object().shape({
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .min(4, "O nome deve ter no mínimo 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  ingredientes: yup.array().of(
    yup.object().shape({
      nome: yup.string().required("O nome do ingrediente é obrigatório"),
      quantidade: yup.string().required("A quantidade é obrigatória"),
    })
  ),
  tempoDeCozimento: yup
    .number()
    .positive()
    .required("O tempo de cozimento é obrigatório")
    .typeError("O tempo de cozimento deve ser um número"),
  rendimento: yup
    .number()
    .positive()
    .required("O rendimento é obrigatório")
    .typeError("O rendimento deve ser um número"),
  nivelDificuldade: yup
    .string()
    .required("O nível de dificuldade é obrigatório"),
  modoPreparo: yup.string().required("O modo de preparo é obrigatório"),
  imagens: yup
    .array()
    .of(yup.string().url("Deve ser uma URL válida"))
    .typeError("Deve ser uma URL válida"),
});

const RegisterRevenue = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Receita>({
    resolver: yupResolver(schema),
  });

  const toggleMenu =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if ("key" in event && (event.key === "Tab" || event.key === "Shift")) {
        return;
      }
      setMenuAberto(open);
    };

  const { fields, append, remove } = useFieldArray({
    name: "ingredientes",
    control,
  });

  const onSubmit = async (data: Receita) => {
    data.emailUsuario = localStorage.getItem("email") as string;

    try {
      if (!data.emailUsuario) {
        alert("Você precisa estar logado para cadastrar uma receita.");
        navigate("/login");
      }
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para cadastrar uma receita.");
        navigate("/login");
      }

      await api.post(
        "/receita/cadastrar",
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Receita cadastrada com sucesso!");
      navigate("/");
    } catch (error: unknown) {
      console.error("Erro ao cadastrar receita:", error);
      alert(
        "Falha ao cadastrar receita. Verifique os campos e tente novamente."
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

      {/* Formulário de Cadastro de Receita */}
      <h2 className="text-2xl font-bold text-center mb-4">Cadastrar Receita</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-6 md:p-8 border rounded-4xl w-full max-w-4xl mx-auto bg-[#F0A04B]"
      >
        <div className="flex flex-col">
          <label className="font-bold">Nome:</label>
          <input
            {...register("nome")}
            className="border p-2 w-full rounded-md"
          />
          <p className="text-red-500 text-sm">{errors.nome?.message}</p>
        </div>

        <div className="space-y-4">
          <label className="font-bold">Ingredientes: </label>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2"
            >
              <input
                {...register(`ingredientes.${index}.nome` as const)}
                placeholder="Nome"
                className="border p-2 rounded-md w-full"
              />
              <input
                type="text"
                {...register(`ingredientes.${index}.quantidade` as const)}
                placeholder="Quantidade"
                className="border p-2 rounded-md w-full"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ nome: "", quantidade: "" })}
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition"
          >
            Adicionar Ingrediente
          </button>
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Modo de Preparo:</label>
          <textarea
            {...register("modoPreparo")}
            className="border p-2 w-full rounded-md"
          />
          <p className="text-red-500 text-sm">{errors.modoPreparo?.message}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-bold">Tempo de Cozimento (min):</label>
            <input
              type="number"
              {...register("tempoDeCozimento")}
              className="border p-2 w-full rounded-md"
            />
            <p className="text-red-500 text-sm">
              {errors.tempoDeCozimento?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Rendimento:</label>
            <input
              type="number"
              {...register("rendimento")}
              className="border p-2 w-full rounded-md"
            />
            <p className="text-red-500 text-sm">{errors.rendimento?.message}</p>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-bold">Nível de Dificuldade:</label>
          <select
            {...register("nivelDificuldade")}
            className="border p-2 w-full rounded-md"
          >
            <option value="">Selecione</option>
            <option value="FACIL">Fácil</option>
            <option value="MEDIO">Médio</option>
            <option value="DIFICIL">Difícil</option>
          </select>
          <p className="text-red-500 text-sm">
            {errors.nivelDificuldade?.message}
          </p>
        </div>

        <div className="flex flex-col">
          <label className="font-bold">Imagens (URLs):</label>
          <input
            {...register("imagens.0")}
            className="border p-2 w-full rounded-md"
          />
          <p className="text-red-500 text-sm">{errors.imagens?.[0]?.message}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full sm:w-auto px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Cadastrar Receita
        </button>
      </form>
    </div>
  );
};

export default RegisterRevenue;
