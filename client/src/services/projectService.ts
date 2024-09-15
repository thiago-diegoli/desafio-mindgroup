import axios from 'axios';

const API_URL = 'http://localhost:4000/api/projects';

export const createProject = async (projectData: { name: string; description?: string }) => {
  try {
    const response = await axios.post(`${API_URL}/create`, projectData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro no serviço de projetos:', error.message);
      throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
    } else {
      console.error('Erro desconhecido no serviço de projetos:', error);
      throw new Error('Erro desconhecido');
    }
  }
};

export const getAllProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro no serviço de projetos:', error.message);
      throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
    } else {
      console.error('Erro desconhecido no serviço de projetos:', error);
      throw new Error('Erro desconhecido');
    }
  }
};
