import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };
  
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

export const getTaskByProject = async (projectId: number) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/project/${projectId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas do projeto:', error);
    throw error;
  }
}

export const getTaskByUser = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas do usuário:', error);
    throw error;
  }
}

export const createTask = async (taskData: {
    name: string;
    description: string;
    deliveryDate: string;
    projectId: number;
    responsibleId: number;
  }) => {
    try {
      const response = await axios.post(`${API_URL}/tasks/create`, taskData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  };

export const updateTaskStatus = async (taskId: number, status: string) => {
    try {
      const response = await axios.patch(`${API_URL}/tasks/status`, { taskId, status }, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
      throw error;
    }
  };

export const deleteTask = async (taskId: number) => {
    try {
        await axios.delete(`${API_URL}/tasks/${taskId}`, {
            headers: getAuthHeaders(),
        });
        return { message: 'Tarefa deletada com sucesso' };
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        throw error;
    }
};