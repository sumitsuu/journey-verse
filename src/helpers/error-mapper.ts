import { AxiosError } from "axios";

export default (error: AxiosError) => {
  switch (error.message) {
    case "Request failed with status code 404":
      return "Requested address not found. Error code: 404. Please contact support.";
  }
};
