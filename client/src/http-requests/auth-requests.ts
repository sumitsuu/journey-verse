import { GET, POST } from "./api";

export default {
  async registration(candidate: { email: string; password: string; displayName: string }) {
    try {
      return await POST("auth/register", candidate);
    } catch (e) {
      throw new Error("Error");
    }
  },
  async checkAuth() {
    try {
      const response = await GET("auth/refresh", {
        withCredentials: true,
      });

      if (response) {
        return { ...response.data };
      }
      return { isAuth: false };
    } catch (e) {
      console.log(e);
    }
  },
  async logout() {
    try {
      await POST("auth/logout");
    } catch (e) {
      console.log(e);
    }
  },

  async login(candidate: { email: string; password: string }) {
    try {
      const { data } = await POST("auth/login", candidate);
      return data;
    } catch (e) {
      throw new Error("Error");
    }
  },
};
