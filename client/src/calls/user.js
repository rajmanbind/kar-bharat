import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_URL ;
export const getskillList = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/skill-list`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    return response.data; // Return the user object from the response
  } catch (error) {
    console.error("Skill list : ", error);
    return error.response.data;
  }
};
export const searchWorker = async (token,params) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/search-worker?${params}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    return response.data; // Return the user object from the response
  } catch (error) {
    console.error("Worker list : ", error);
    return error.response.data;
  }
};
