import { getDatabase } from "../database/db";
export async function loginUser(email: string, password: string) {
  const database = await getDatabase();
  const result = await database.getAllAsync(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password]
  );

  if (!result) {
    throw new Error("Credenciais inválidas.");
  }

  console.log("Usuário logado:", result);
  return result;
}