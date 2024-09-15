import axios from 'axios';
interface User {
  id: number;
  name: string;
  email: string;
  photo: string | null;
}

const API_URL = 'http://localhost:4000/api';

const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const updateUserPhoto = async (userId: string, base64String: string) => {
  try {
    const response = await axios.put(`${API_URL}/logins/users/${userId}/photo`, {
      photoBase64: base64String,
    }, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao atualizar a foto do usuário:', error.message);
      throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
    } else {
      console.error('Erro desconhecido ao atualizar a foto do usuário:', error);
      throw new Error('Erro desconhecido');
    }
  }
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await axios.get<User>(`${API_URL}/logins/users/${userId}`);
  return response.data;
};