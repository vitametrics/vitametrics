import axios from "axios";

export const forgotPassword = async (email: string) => {
    try {
        const res = await axios.post(`${process.env.API_URL}/user/forgot-password`, {
           email: email,
          },
          {
            withCredentials: true,
          });
          if (res.status !== 200) {
            throw new Error(res.data.message || "Failed to send password reset link");
          }
          
        return res.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
}
