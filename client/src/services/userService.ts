import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const updateUserPhoto = async (userId: string, base64String: string) => {
  const response = await axios.put(`${API_URL}/logins/users/${userId}/photo`, {
    photoBase64: base64String,
  });

  return response.data;
};
