import { getDatabase } from './db';

export async function initializeDatabase() {
  const database = await getDatabase();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS primaryList (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS secondaryList (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      primaryListId INTEGER,
      FOREIGN KEY (primaryListId) REFERENCES primaryList(id)
    );
  `);

  console.log('Tabelas criadas ou verificadas com sucesso');
}
