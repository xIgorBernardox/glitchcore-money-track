import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Button, View } from 'react-native';

export default function ExportarBanco() {
  const compartilharBanco = async () => {
    const dbPath = FileSystem.documentDirectory + 'money-track.db';
    const exportPath = FileSystem.documentDirectory + 'exportado.db';

    const info = await FileSystem.getInfoAsync(dbPath);
    if (info.exists) {
      await FileSystem.copyAsync({ from: dbPath, to: exportPath });
      await Sharing.shareAsync(exportPath);
    } else {
      console.log('Banco não encontrado.');
    }
  };

  return (
    <View style={{ marginTop: 50, padding: 20 }}>
      <Button title="Exportar e Compartilhar Banco" onPress={compartilharBanco} />
    </View>
  );
}
