import { GET } from "./api";

export default {
  async getStatuses() {
    try {
      const response = await GET("status");
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
};
