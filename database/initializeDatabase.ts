import { getDatabase } from './db';

export async function initializeDatabase() {
  const database = await getDatabase();

  // Criação inicial das tabelas
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
  const tablesToCheck = ['primaryList', 'secondaryList'];
  
  for (const table of tablesToCheck) {
    const result = await database.getAllAsync(
      `PRAGMA table_info(${table});`
    );

    const hasPositionColumn = result.some(
      (col: any) => col.name === 'position'
    );

    if (!hasPositionColumn) {
      await database.execAsync(`
        ALTER TABLE ${table} ADD COLUMN position INTEGER DEFAULT 0;
      `);
      console.log(`Coluna "position" adicionada em ${table}`);
    }
  }
}