import { GET } from "./api";

export default {
  async getTypes() {
    try {
      const response = await GET("type");
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
};
