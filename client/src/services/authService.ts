import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  photo?: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/logins/register`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro ao registrar o usuário: ${error.response?.data?.message || error.message}`);
    }
    throw new Error(`Erro ao registrar o usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/logins`, credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro ao fazer login: ${error.response?.data?.message || error.message}`);
    }
    throw new Error(`Erro ao fazer login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};
