import { IUpdateUserPasswordArgs } from "../types/requests/user-requests";
import { DELETE, GET, POST, PUT } from "./api";

export const userRequests = {
  async addLibraryItem(data: any, typeId: number) {
    try {
      return await POST(`user/add-library-item/${typeId}`, data);
    } catch (e) {
      console.log(e);
    }
  },
  async getLibrary(id: number, typeId: number) {
    try {
      const { data } = await GET(`user/get-library/${id}/${typeId}`);
      return data;
    } catch (e) {
      console.log(e);
    }
  },
  async deleteLibraryItem(userId: number, artId: number, typeId: number) {
    try {
      return await DELETE(`user/delete-library-item/${typeId}`, {
        data: { userId, artId },
      });
    } catch (e) {
      console.log(e);
    }
  },
  async updateUserPassword(data: IUpdateUserPasswordArgs) {
    try {
      return await PUT("user/update-user-password/", data);
    } catch (e) {
      console.log(e);
    }
  },
  async updateUserAvatar(body: any, id: number) {
    try {
      const { data } = await PUT(`user/update-user-avatar/${id}`, body);
      return data;
    } catch (e) {
      console.log(e);
    }
  },
  async updateUserName(data: { name: string; id: number }) {
    try {
      const { name, id } = data;
      return await PUT(`user/update-user-name/${id}`, { name });
    } catch (e) {
      console.log(e);
    }
  },
  async updateLibItem(value: number, itemId: number, itemKey: string, typeId: number, userId: number) {
    try {
      await PUT(`user/update-user-lib-item/${userId}`, {
        itemKey,
        value,
        typeId,
        itemId,
      });
    } catch (e) {
      console.log(e);
    }
  },
  async getUserLibRows(typeId: number) {
    try {
      const { data } = await GET(`user/get-user-library-rows/${typeId}`);
      return data;
    } catch (e) {
      console.log(e);
    }
  },
  async updateUserLibType(typeId: number, userId: number) {
    const { data } = await PUT(`user/update-user-lib-type/${userId}/${typeId}`);
    return data;
  },
};
