import { AxiosError } from "axios";

export default (error: AxiosError) => {
  switch (error.message) {
    case "Request failed with status code 404":
      return "Запрашиваем адресс не найден. Код ошибки: 404. Свяжитесь с поддержкой.";
  }
};
