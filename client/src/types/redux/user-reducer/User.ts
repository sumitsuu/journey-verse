export interface IUser {
  id?: number;
  email: string;
  name: string;
  role?: string;
  path?: string;
  typeId?: number;
}

export interface ICandidate {
  email: string;
  password: string;
  displayName: string;
}
