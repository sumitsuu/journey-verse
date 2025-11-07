import { Nullable } from "../../utility/Nullable";

export default interface ISnackbar {
  text: string;
  type?: string;
  additionData?: Nullable<string>;
  canBeClosed?: boolean;
  isOpen?: boolean;
}
