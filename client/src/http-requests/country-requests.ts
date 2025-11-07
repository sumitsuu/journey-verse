import { GET } from "./api";

export default {
  async getCountries() {
    try {
      const response = await GET("country");
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
};
