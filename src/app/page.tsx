import { redirect } from "next/navigation";

export default function Home() {
  // "/" nunca renderiza conteúdo próprio — a tela padrão de abertura é o
  // Login (ver activeContext.md). Quando a rota protegida "(app)" existir,
  // esta função deve checar a sessão e redirecionar para "/dashboard" caso
  // o usuário já esteja autenticado.
  redirect("/login");
}
