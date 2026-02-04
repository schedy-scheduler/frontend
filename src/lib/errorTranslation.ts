// Mapeamento de mensagens de erro do Supabase para português
const errorTranslations: Record<string, string> = {
  // Erros de autenticação
  "Invalid login credentials": "Credenciais de login inválidas",
  "Email not confirmed": "E-mail não confirmado",
  "User already registered": "Usuário já cadastrado",
  "Password should be at least 6 characters":
    "A senha deve ter no mínimo 6 caracteres",
  "Unable to validate email address: invalid format":
    "Formato de e-mail inválido",
  "Signup requires a valid password": "O cadastro requer uma senha válida",
  "User not found": "Usuário não encontrado",
  "Email rate limit exceeded": "Limite de tentativas de e-mail excedido",
  "For security purposes, you can only request this once every 60 seconds":
    "Por segurança, você só pode solicitar isso uma vez a cada 60 segundos",
  "New password should be different from the old password":
    "A nova senha deve ser diferente da senha antiga",
  "Auth session missing!": "Sessão de autenticação ausente!",
  "Token has expired or is invalid": "Token expirado ou inválido",
  "Invalid refresh token": "Token de atualização inválido",
  "Session not found": "Sessão não encontrada",

  // Erros de banco de dados
  "duplicate key value violates unique constraint":
    "Valor duplicado viola restrição de unicidade",
  "violates foreign key constraint": "Viola restrição de chave estrangeira",
  "null value in column": "Valor nulo em coluna obrigatória",
  "Row not found": "Registro não encontrado",
  "permission denied": "Permissão negada",
  "relation does not exist": "Tabela não existe",

  // Erros de rede
  "Failed to fetch": "Falha na conexão com o servidor",
  "Network request failed": "Falha na requisição de rede",
  NetworkError: "Erro de rede",
  "Request timeout": "Tempo limite de requisição excedido",

  // Erros de storage
  "The resource already exists": "O recurso já existe",
  "Object not found": "Objeto não encontrado",
  "Bucket not found": "Bucket não encontrado",
  "The object exceeds the maximum allowed size":
    "O arquivo excede o tamanho máximo permitido",

  // Erros genéricos
  "Internal server error": "Erro interno do servidor",
  "Service unavailable": "Serviço indisponível",
  "Bad request": "Requisição inválida",
  Unauthorized: "Não autorizado",
  Forbidden: "Acesso proibido",
  "Not found": "Não encontrado",
};

/**
 * Traduz mensagens de erro do Supabase/inglês para português
 * @param error - A mensagem de erro original
 * @returns A mensagem de erro traduzida
 */
export const translateError = (error: string | null | undefined): string => {
  if (!error) return "Ocorreu um erro desconhecido";

  // Verifica tradução exata
  if (errorTranslations[error]) {
    return errorTranslations[error];
  }

  // Verifica se alguma tradução parcial se aplica
  for (const [key, value] of Object.entries(errorTranslations)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Se não encontrar tradução, retorna o erro original
  return error;
};
