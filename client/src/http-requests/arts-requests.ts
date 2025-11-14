import { Genre } from "../types/models/genre.types";
import { Type } from "../types/models/type.types";
import { GET, POST } from "./api";

const artsRequests = {
  async getArts(typeId: number, sortOptions: Record<string, string>) {
    try {
      const { data } = await GET(`arts/${typeId}`, {
        params: sortOptions,
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  },
  async checkIsInLibrary(itemId: number, userId: number, type: string) {
    try {
      const response = await GET("user/check-is-in-library", {
        params: {
          itemId,
          userId,
          type,
        },
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  },
  async getOneArt(id: number, type: string) {
    try {
      const { data } = await GET(`arts/art/${type}/${id}`);
      return data;
    } catch (e) {
      console.log(e);
    }
  },
  async getGenres(typeId: number) {
    try {
      const response = await GET(`arts/genres/${typeId}`);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
  async getTypes() {
    try {
      const response = await GET("arts/types");
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
  async getStatuses(typeId: number, partOf: string) {
    try {
      const { data } = await GET(`arts/statuses/${partOf}/${typeId}`);

      return data;
    } catch (e) {
      console.log(e);
    }
  },
  async getStatusesByType(partOf: string) {
    try {
      const { data } = await GET(`arts/statuses/${partOf}`);
      return data;
    } catch (e) {
      console.log(e);
    }
  },
  async getRatings() {
    try {
      const { data } = await GET("arts/ratings");
      return data;
    } catch (e) {
      console.log(e);
    }
  },
  async createType(data: Type) {
    try {
      const response = await POST("arts/create-type", data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
  async createGenre(data: Genre) {
    try {
      await POST("arts/create-genre", data);
    } catch (e) {
      console.log(e);
    }
  },
  async createArt(data: FormData) {
    try {
      await POST("arts/create", data);
    } catch (e) {
      const error = e as Error;
      console.log(error.message);
    }
  },
  async getSortOptions(type: number) {
    try {
      const { data } = await GET(`arts/sort-options/${type}`);
      return data;
    } catch (e) {
      console.log(e);
    }
  },
  async searchArts(searchValue: string) {
    try {
      const { data } = await POST("arts/get-filtered-arts", {
        searchValue,
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  },
};

export default artsRequests;
