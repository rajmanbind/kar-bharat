import axios from "axios";
// const BASE_URL = import.meta.env.VITE_SERVER_URL + "/auth";
const BASE_URL = "https://server-rajmanbinds-projects.vercel.app/api/v1" + "/auth";
export const registerUser = async (userData) => {
  try {
    const response =  await axios.post(`${BASE_URL}/register`,userData);

    return response.data; 
  } catch (error) {
    console.error("Registration Error:", error);
    return error.response.data;
  }
};
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, userData);

    console.log("Data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in Login", error.response?.data||error);
    console.log("Error in Login",error);
    return error.response?.data||error;
  }
};

export const registerUserTwo = async (formData, token) => {
  console.log("formData", formData);
  try {
    const response = await axios.put(`${BASE_URL}/register-two`, formData, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
      // withCredentials: true, // Uncomment if needed for cookies
    });
    console.log("Data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in completing profile:", error);
    // console.log(error);
    return error.response.data;
  }
};

export const sendOtp = async (userData) => {
  console.log("BASE URL", BASE_URL);
  // return;
  try {
    const response = await fetch(`${BASE_URL}/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Getting OTP failed");
    }

    const data = await response.json();
    console.log("Data: ", data);
    return data; // Return the user object from the response
  } catch (error) {
    console.error("Get OTP Error:", error);
    throw error; // Rethrow to handle it in the calling function
  }
};
export const verifyOtp = async (userData) => {
  // return;
  try {
    const response = await axios.post(`${BASE_URL}/verify-otp`,userData);

    return response.data; // Return the user object from the response
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return error.response.data;
  }
};
