import axios from "axios";

export const forgotPassword = async (email: string) => {
    try {
        const res = await axios.post(`${process.env.API_URL}/user/forgot-password`, {
           email: email,
          },
          {
            withCredentials: true,
          });
        return res.data;
    } catch (error) {
        console.error("Error changing password:", error);
        return error;
    }
}
