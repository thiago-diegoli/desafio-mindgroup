import axios from 'axios';
interface User {
  id: number;
  name: string;
  email: string;
  photo: string | null;
}

const API_URL = 'http://localhost:4000/api';

export const updateUserPhoto = async (userId: string, base64String: string) => {
  const response = await axios.put(`${API_URL}/logins/users/${userId}/photo`, {
    photoBase64: base64String,
  });

  return response.data;
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await axios.get<User>(`${API_URL}/logins/users/${userId}`);
  return response.data;
};