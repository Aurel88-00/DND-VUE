import { instance } from ".";
import { type ILogin } from "../lib/interfaces/login.interface";
import { type IRegister } from "../lib/interfaces/register.interface";

export const login = (
  payload: ILogin
): Promise<{ accessToken: string; refreshToken: string } | any> => {
  return instance.post("/login", payload);
};

export const register = (
  payload: IRegister
): Promise<{ accessToken: string } | any> => {
  return instance.post("/register", payload);
};

export const refreshToken = (payload: string) => {
  return instance.post("/refresh", payload);
};
