import { GET } from "./api";

export default {
  async getGenres() {
    try {
      const response = await GET("genre");
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
};
