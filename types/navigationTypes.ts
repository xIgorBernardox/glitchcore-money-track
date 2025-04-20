export type RootStackParamList = {
  login: undefined; // ou 'phoneNumber: string', se você precisar passar dados
  register: undefined;
  'Minhas Listas': undefined;
  'secondaryList': { listId: string };
  // Adicione mais rotas aqui conforme necessário
};