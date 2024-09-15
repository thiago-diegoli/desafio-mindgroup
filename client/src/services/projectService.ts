import axios from 'axios';

const API_URL = 'http://localhost:4000/api/projects';

const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createProject = async (projectData: { name: string; description?: string }) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }
    const response = await axios.post(`${API_URL}/create`, { ...projectData, userId }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao criar projeto:', error.message);
      throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
    } else {
      console.error('Erro desconhecido ao criar projeto:', error);
      throw new Error('Erro desconhecido');
    }
  }
};

export const getAllProjects = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter projetos:', error.message);
      throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
    } else {
      console.error('Erro desconhecido ao obter projetos:', error);
      throw new Error('Erro desconhecido');
    }
  }
};

export const getAllProjectsById = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter projetos pelo ID do usuário:', error.message);
      throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
    } else {
      console.error('Erro desconhecido ao obter projetos pelo ID do usuário:', error);
      throw new Error('Erro desconhecido');
    }
  }
};

export const getProjectById = async (projectId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter o projeto pelo ID:', error.message);
      throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
    } else {
      console.error('Erro desconhecido ao obter o projeto pelo ID:', error);
      throw new Error('Erro desconhecido');
    }
  }
};

export const updateProject = async (projectId: number, updateData: { name?: string; description?: string }) => {
  try {
    const response = await axios.put(`${API_URL}/update/${projectId}`, updateData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao atualizar projeto:', error.message);
      throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
    } else {
      console.error('Erro desconhecido ao atualizar projeto:', error);
      throw new Error('Erro desconhecido');
    }
  }
};

export const deleteProject = async (projectId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${projectId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao deletar projeto:', error.message);
      throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
    } else {
      console.error('Erro desconhecido ao deletar projeto:', error);
      throw new Error('Erro desconhecido');
    }
  }
};
