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
    if (axios.isAxiosError(error) && error.response) {
      const errorMessages = error.response.data.errors
        ? error.response.data.errors.map((err: { msg: string }) => err.msg).join('; ')
        : error.message;
      throw new Error(`Erro ao registrar o usuário: ${errorMessages}`);
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
    const { access_token, userId, name, photo } = response.data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);
    if (photo) {
      localStorage.setItem('userPhoto', photo);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessages = error.response.data.errors
        ? error.response.data.errors.map((err: { msg: string }) => err.msg).join('; ')
        : error.message;
      throw new Error(`Erro ao fazer login: ${errorMessages}`);
    }
    throw new Error(`Erro ao fazer login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};
