export type RootStackParamList = {
  login: undefined; // Tela de login
  register: undefined; // Tela de registro
  'Minhas Listas': undefined; // Tela das listas
  'secondaryList': { listId: string }; // Tela de lista secundária com o parâmetro 'listId'
  // Adicione mais rotas conforme necessário
  'tabelas': undefined;
};