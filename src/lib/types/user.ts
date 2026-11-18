export interface IUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "admin";
  isBlocked?: boolean;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}
