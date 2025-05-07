import { getDatabase } from './db';
import { initializeDatabase } from './initializeDatabase';

export async function registerUser(username: string, email: string, phone: string, password: string) {
  try {
    // Certifique-se de que o banco de dados foi inicializado antes de registrar o usuário
    await initializeDatabase();

    const database = await getDatabase();

    // Verificando se o e-mail e o username já existem
    const existingUser = await database.getAllAsync(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUser) {
      throw new Error("Usuário com esse e-mail ou nome de usuário já existe.");
    }

    // Inserindo o novo usuário na tabela 'users'
    const result = await database.runAsync(
      "INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)",
      [username, email, phone, password]
    );

    console.log("Usuário registrado:", result);
    return result;
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    throw err;
  }
}