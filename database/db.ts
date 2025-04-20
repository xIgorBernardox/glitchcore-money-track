import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

export async function getDatabase(): Promise<SQLiteDatabase> {
  return await openDatabaseAsync('money-track.db');
}
